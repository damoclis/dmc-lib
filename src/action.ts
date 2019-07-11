import { Address } from "./address";
import { Assert } from "./system";
import { RIPEMD160_LEN, SHA256_LEN, SHA512_LEN } from "../lib/constant";
import { getActionName, getActionData, hasAuth, requireAuth, callAction, returnData, returnU64 } from "../internal/action";
import { BytesToString, EncodeSLEB128, EncodeULEB128, StringToBytes, StringToUsize } from "../lib/codec";
import { U8ArrayToBytes, CreateDataStream, } from "../lib/helper";
import { Asset } from "./asset";

/**
 * Builtin represents a parameter with built-in type.
 * Only support 'bool','int8','uint8','int16','uint16','int32','uint32','int64','uint64',
 * 'varint32','varuint32','address','publicKey','signature'
 */
export class Builtin implements Serializable {
  _val: Bytes;

  constructor(val: Bytes) { this._val = val; }

  static fromI32(val: i32): Builtin {
    return Builtin.fromU32(val);
  }

  static fromU32(val: u32): Builtin {
    let bytes = new Bytes(4);
    let i = 0;
    while (i < bytes.length) {
      let c: u8 = (val >> (i * 8)) & 0xff;
      bytes[i] = c;
    }
    return new Builtin(bytes);
  }

  static fromI64(val: i64): Builtin {
    return Builtin.fromU64(val);
  }

  static fromU64(val: u64): Builtin {
    let bytes = new Bytes(8);
    let i = 0;
    while (i < bytes.length) {
      let c: u8 = (val >> (i * 8)) & 0xff;
      bytes[i] = c;
    }
    return new Builtin(bytes);
  }

  static fromI8(val: i8): Builtin {
    return Builtin.fromU8(val);
  }

  static fromU8(val: u8): Builtin {
    let bytes = new Bytes(1);
    bytes[0] = val;
    return new Builtin(bytes);
  }

  static fromI16(val: i16): Builtin {
    return Builtin.fromU16(val);
  }

  static fromU16(val: u16): Builtin {
    let bytes = new Bytes(2);
    let i = 0;
    while (i < bytes.length) {
      let c: u8 = (val >> (i * 8)) & 0xff;
      bytes[i] = c;
    }
    return new Builtin(bytes);
  }

  // Encode a Signed LEB128 variable-length integer to bytes.
  static fromVari32(val: i32): Builtin {
    return new Builtin(EncodeSLEB128(val));
  }

  // Encode a LEB128 variable-length integer to bytes.
  static fromVaru32(val: u32): Builtin {
    return new Builtin(EncodeULEB128(val));
  }

  static fromAddress(addr: Address): Builtin {
    return new Builtin(addr.bytes())
  }

  static fromString(str: string): Builtin {
    return new Builtin(StringToBytes(str));
  }

  static fromBytes(bytes: Bytes): Builtin {
    return new Builtin(bytes);
  }

  static fromHash160(bytes: Bytes): Builtin {
    Assert(bytes.length == RIPEMD160_LEN, 'invalid Hash160 length');
    return new Builtin(bytes);
  }

  static fromHash256(bytes: Bytes): Builtin {
    Assert(bytes.length == SHA256_LEN, 'invalid Hash256 length');
    return new Builtin(bytes);
  }

  static fromHash512(bytes: Bytes): Builtin {
    Assert(bytes.length == SHA512_LEN, 'invalid Hash512 length');
    return new Builtin(bytes);
  }

  len(): i32 {
    return this._val.length;
  }

  serialize(ds: DataStream): void {
    const arr = new Array<u8>(this.len());
    WriteBytesToU8Array(this._val, arr);
    ds.writeVector<u8>(arr);
  }

  deserialize(ds: DataStream): void {
    const arr = ds.readVector<u8>();
    this._val = U8ArrayToBytes(arr);
  }

  key(): string {
    return "";
  }
}

/**
 * BuiltinArray represents an array of parameters with built-in types,
 * like 'string[]', 'u64[]'
 */
export class BuiltinArray extends Builtin implements Serializable {
  _params: Builtin[]

  constructor(params: Builtin[]) {
    super(new Bytes(0));
    this._params = params;
  }

  len(): i32 {
    return this._params.length
  }

  serialize(ds: DataStream): void {
    ds.writeComplexVector<Builtin>(this._params);
  }

  deserialize(ds: DataStream): void {
    this._params = ds.readComplexVector<Builtin>();
  }

  key(): string {
    return "";
  }
}

export class Action implements Serializable {
  _to: Address;
  _value: Asset;
  _method: string;
  _payload: Serializable[];
  _extra: string;

  constructor(to: Address, value: Asset, method: string, payload?: Serializable[], extra?: string) {
    this._to = to;
    this._value = value;
    this._method = method;
    this._payload = payload || [];
    this._extra = extra || "";
  }

  static getActionName(): string {
    const size = getActionName(0, 0);
    const bytes = new Bytes(size);
    getActionName(changetype<usize>(bytes.buffer), size);
    return BytesToString(bytes);
  }

  static getActionData(): DataStream {
    const size = getActionData(0, 0);
    const bytes = new Bytes(size);
    const ds = new DataStream(changetype<usize>(bytes.buffer), size);
    getActionData(ds.buffer, ds.len);
    return ds;
  }

  send(): void {
    Assert(this._method != "__DEPLOY__", "action name should not be '__DEPLOY__'");
    const size = DataStream.measure<Action>(this);
    const ds = CreateDataStream(size)
    this.serialize(ds);
    callAction(ds.buffer, ds.len);
  }

  serialize(ds: DataStream): void {
    // fill _to address
    this._to.serialize(ds);
    // fill the u64 value
    this._value.serialize(ds);
    // fill the method of action
    ds.writeString(this._method);
    let payloadSize = 0;
    // fill serialized payload field
    for (let i = 0; i < this._payload.length; i++) {
      const param = this._payload[i];
      if (param instanceof Builtin) {
        payloadSize += DataStream.measure<Builtin>(param)
      } else if (param instanceof BuiltinArray) {
        payloadSize += DataStream.measure<BuiltinArray>(param);
      } else {
        throw new Error("unknown parameters type");
      }
    }
    for (let i = 0; i < this._payload.length; i++) {
      this._payload[i].serialize(ds);
    }
    // fill extra field
    ds.writeString(this._extra);
  }

  deserialize(ds: DataStream): void {
    return;
  }

  key(): string {
    return "";
  }
}

/**
 * Verifies and returns whether the address is the sender.
 * 
 * @param addr - address of a certain account
 */
export function HasAuth(addr: Address): bool {
  return hasAuth(addr.buffer);
}

/**
 * Verifies the given address is the sender and throw error if not.
 * 
 * @param addr - address of a certain account
 */
export function RequireAuth(addr: Address): void {
  return requireAuth(addr.buffer);
}

/**
 * Set bytes as return data of action.
 * 
 * @param bytes - bytes array
 */
export function ReturnBytes(bytes: Bytes): void {
  returnData(changetype<usize>(bytes.buffer), bytes.length);
}

/**
 * Set string as return data of action.
 * 
 * @param str - a string
 */
export function ReturnString(str: string): void {
  returnData(StringToUsize(str), str.length);
}

/**
 * Set uint64 value as return data of action.
 * 
 * @param v - u64 value
 */
export function ReturnU64(v: u64): void {
  returnU64(v);
}