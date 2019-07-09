import { Address } from "./address";
import { Assert } from "./system";
import { RIPEMD160_LEN, SHA256_LEN, SHA512_LEN } from "../lib/constant";
import { getActionName, getActionData, hasAuth, requireAuth, callAction, returnData } from "../internal/action";
import { BytesToString, DecodeSLEB128, EncodeSLEB128, EncodeULEB128, StringToBytes, StringToUsize } from "../lib/codec";
import { U8ArrayToBytes, ConcatBytes, WriteBytesToU8Array } from "../lib/helper";

export interface Parameter {
  len(): i32;
  bytes(): Bytes;
}

/**
 * Builtin represents a parameter with built-in type.
 * Only support 'bool','int8','uint8','int16','uint16','int32','uint32','int64','uint64',
 * 'varint32','varuint32','address','publicKey','signature'
 */
export class Builtin implements Parameter {
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

  bytes(): Bytes {
    return this._val;
  }

  len(): i32 {
    return this._val.length;
  }
}

/**
 * BuiltinArray represents an array of parameters with built-in types,
 * like 'string[]', 'u64[]'
 */
export class BuiltinArray implements Parameter {
  _params: Array<Builtin>
  constructor(params: Array<Builtin>) {
    this._params = params;
  }

  bytes(): Bytes {
    const size = this._params.length;
    const sizeBytes = Builtin.fromU32(size).bytes();
    const out = new Array<u8>();
    this._params.forEach(function (item: Builtin): void {
      item.bytes().forEach(function (byte: u8): void {
        out.push(byte)
      })
    })

    return ConcatBytes(sizeBytes, U8ArrayToBytes(out));
  }

  len(): i32 {
    return this._params.length
  }
}

export class Action {
  _to: Address;
  _value: u64;
  _method: string;
  _payload: Array<Parameter>;
  _extra: string;

  constructor(to: Address, value: u64, method: string, payload?: Array<Parameter>, extra?: string) {
    this._to = to;
    this._value = value;
    this._method = method;
    this._payload = payload || new Array<Parameter>();
    this._extra = extra || "";
  }

  static hasAuth(addr: Address): bool {
    return hasAuth(addr.buffer);
  }

  static requireAuth(addr: Address): void {
    return requireAuth(addr.buffer);
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

  static returnBytes(bytes: Bytes): void {
    returnData(changetype<usize>(bytes.buffer), bytes.length);
  }

  static returnString(str: string): void {
    returnData(StringToUsize(str), str.length);
  }

  static returnU64(v: u64): void {
    returnData(changetype<usize>(Builtin.fromU64(v).bytes()), 8);
  }

  static returnU8(v: u8): void {
    const bytes = new Bytes(1)
    bytes[0] = v;
    returnData(changetype<usize>(v), 1);
  }

  send(): void {
    const ser = this.serialize();
    callAction(changetype<usize>(ser.buffer), ser.length);
  }

  serialize(): Bytes {
    let serialize = new Array<u8>();
    WriteBytesToU8Array(this._to.bytes(), serialize);
    WriteBytesToU8Array(Builtin.fromU64(this._value).bytes(), serialize);
    WriteBytesToU8Array(Builtin.fromU32(this._method.length).bytes(), serialize);
    WriteBytesToU8Array(StringToBytes(this._method), serialize);
    // concat serialized bytes array of each parameter.
    this._payload.forEach(function (item: Parameter): void {
      WriteBytesToU8Array(item.bytes(), serialize);
    })
    WriteBytesToU8Array(Builtin.fromU32(this._extra.length).bytes(), serialize);
    WriteBytesToU8Array(StringToBytes(this._extra), serialize);
    return U8ArrayToBytes(serialize);
  }
}