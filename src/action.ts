import { Address } from "./address";
import { Assert } from "./system";
import { RIPEMD160_LEN, SHA256_LEN, SHA512_LEN } from "../lib/constant";
import { getActionName, getActionData, hasAuth, requireAuth, callAction, getValue } from "../internal/action.d";
import { EncodeSLEB128 } from "../lib/codec";
import { CreateDataStream, } from "../lib/helper";
import { Asset, UNIT } from "./asset";

/**
 * Builtin represents a parameter with built-in type.
 * Only support 'bool','int8','uint8','int16','uint16','int32','uint32','int64','uint64',
 * 'varint32','varuint32','address','publicKey','signature'
 */
export class Builtin implements Serializable {
  _val: DataStream;

  constructor(val: DataStream) { this._val = val; }

  static fromI32(val: i32): Builtin {
    return Builtin.fromU32(val);
  }

  static fromU32(val: u32): Builtin {
    const ds = CreateDataStream(4);
    ds.write<u32>(val)
    return new Builtin(ds);
  }

  static fromI64(val: i64): Builtin {
    return Builtin.fromU64(val);
  }

  static fromU64(val: u64): Builtin {
    const ds = CreateDataStream(8);
    ds.write<u64>(val);
    return new Builtin(ds);
  }

  static fromI8(val: i8): Builtin {
    return Builtin.fromU8(val);
  }

  static fromU8(val: u8): Builtin {
    const ds = CreateDataStream(1);
    ds.write<u8>(val);
    return new Builtin(ds);
  }

  static fromI16(val: i16): Builtin {
    return Builtin.fromU16(val);
  }

  static fromU16(val: u16): Builtin {
    const ds = CreateDataStream(2);
    ds.write<u16>(val);
    return new Builtin(ds);
  }

  // Encode a Signed LEB128 variable-length integer to bytes.
  static fromVari32(value: i32): Builtin {
    return new Builtin(DataStream.fromArray<u8>(EncodeSLEB128(value)));
  }

  // Encode a LEB128 variable-length integer to bytes.
  // FIXME: maybe change to ULEB128.
  static fromVaru32(val: u32): Builtin {
    return Builtin.fromVari32(val);
  }

  static fromAddress(addr: Address): Builtin {
    const size = DataStream.measure<Address>(addr);
    const ds = CreateDataStream(size)
    addr.serialize(ds)
    return new Builtin(ds)
  }

  static fromString(str: string): Builtin {
    const sizeDs = Builtin.fromVaru32(str.length);
    const ds = CreateDataStream(sizeDs.bytesLen + str.length);
    ds.writeString(str)
    return new Builtin(ds);
  }

  static fromBytes(bytes: Bytes): Builtin {
    const sizeDs = Builtin.fromVaru32(bytes.length);
    const ds = CreateDataStream(sizeDs.bytesLen + bytes.length);
    ds.writeVector<u8>(bytes.toU8Array());
    return new Builtin(ds);
  }

  static fromHash160(bytes: Bytes): Builtin {
    Assert(bytes.length == RIPEMD160_LEN, 'invalid Hash160 length');
    return Builtin.fromBytes(bytes);
  }

  static fromHash256(bytes: Bytes): Builtin {
    Assert(bytes.length == SHA256_LEN, 'invalid Hash256 length');
    return Builtin.fromBytes(bytes);
  }

  static fromHash512(bytes: Bytes): Builtin {
    Assert(bytes.length == SHA512_LEN, 'invalid Hash512 length');
    return Builtin.fromBytes(bytes);
  }

  static fromArray(params: Builtin[]): Builtin {
    const size = DataStream.measureComplexVector<Builtin>(params);
    const ds = CreateDataStream(size);
    ds.writeComplexVector<Builtin>(params);
    return new Builtin(ds);
  }

  get datastream(): DataStream {
    return this._val;
  }

  get bytesLen(): u32 {
    return this._val.size();
  }

  serialize(ds: DataStream): void {
    const bytesArr = this._val.toArray<u8>();
    for (let i = 0; i < bytesArr.length; i++) {
      ds.write<u8>(bytesArr[i]);
    }
  }

  deserialize(ds: DataStream): void {
    return
  }

  key(): string {
    return "";
  }
}

export class Action implements Serializable {
  _to: Address;
  _value: Asset;
  _method: string;
  _payload: Builtin[];
  _extra: string;

  constructor(to: Address, value: Asset, method: string, payload: Builtin[] = [], extra: string = "") {
    this._to = to;
    this._value = value;
    this._method = method;
    this._payload = payload || [];
    this._extra = extra;
  }

  static getActionName(): string {
    const size = getActionName(0, 0);
    const bytes = new Bytes(size);
    getActionName(changetype<usize>(bytes.buffer), size);
    return bytes.toString();
  }

  static getActionData(): DataStream {
    const size = getActionData(0, 0);
    const ds = CreateDataStream(size)
    getActionData(ds.buffer, ds.len);
    return ds;
  }

  static getValue(): Asset {
    const size = getValue(0, 0);
    const ds = CreateDataStream(size);
    getValue(ds.buffer, ds.len);
    const amount = ds.read<u64>();
    return new Asset(amount, UNIT);
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
    // fill serialized payload field
    const payloadSize = DataStream.measureComplexVector<Builtin>(this._payload);
    const paramsLenDs = Builtin.fromVaru32(<u32>this._payload.length);
    ds.writeVarint32(payloadSize - paramsLenDs.bytesLen);
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
  requireAuth(addr.buffer);
}

/**
 * Set bytes as return data of action.
 *
 * @param bytes - bytes array
 */
