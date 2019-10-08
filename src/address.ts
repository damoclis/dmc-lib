import { Asset } from "./asset";
import { getBalance, transfer } from "../internal/account.d";
import { CreateDataStream } from "../lib/helper";

export class Address implements Serializable {
	_value: Bytes;
	_len: u32 = 20;

	static fromHex(hex: string): Address {
		const addr = new Address();
		addr._value = Bytes.fromHex(hex);
		return addr;
	}

	static fromBytes(raw: Bytes): Address {
		if (raw.length > 20) {
			raw = <Bytes>(<Uint8Array>raw.subarray(0, 20));
		}
		const addr = new Address();
		addr._value = raw;
		return addr;
	}

	hex(): string {
		return this._value.toHex();
	}

	toString(): string {
		return this._value.toString();
	}

	@operator("==")
	equal(t: Address): bool {
		for (let i: u32 = 0; i < this._len; i++) {
			if (this._value[i] != t._value[i]) {
				return false
			}
		}
		return true;
	}

	@operator("!=")
	notEqual(t: Address): bool {
		return !this.equal(t);
	}

	get bytes(): Bytes {
		let byte = Bytes.fromHex("0x14");
		return byte.concat(this._value);
	}

	get buffer(): usize {
		return changetype<usize>(this._value.buffer);
	}

	serialize(ds: DataStream): void {
		ds.writeVector<u8>(this._value.toU8Array());
	}

	deserialize(ds: DataStream): void {
		const arr = ds.readVector<u8>();
		this._value = Bytes.fromU8Array(arr);
	}

	key(): string {
		return "";
	}

	getBalance(): Asset {
		let asset: Asset = new Asset();
		let size = getBalance(this.buffer, 0, 0);
		let ds = CreateDataStream(size);
		getBalance(this.buffer, ds.buffer, ds.len);
		asset.deserialize(ds);
		return asset;
	}

	transfer(to: Address, value: Asset): bool {
		let size = DataStream.measure<Asset>(value);
		let ds = CreateDataStream(size);
		value.serialize(ds);
		return transfer(this.buffer, to.buffer, ds.buffer, size);
	}
}

export class Hash160 implements Serializable{
	_value: Bytes;
	_len: u32 = 20;

	constructor() {
		this._len = 20;
	}

	static fromHex(hex: string): Hash160 {
		const hash = new Hash160();
		hash._value = Bytes.fromHex(hex);
		return hash;
	}

	hex(): string {
		return this._value.toHex();
	}

	toString(): string {
		return this._value.toString();
	}

	@operator("==")
	equal(t: Hash160): bool {
		for (let i: u32 = 0; i < this._len; i++) {
			if (this._value[i] != t._value[i]) {
				return false
			}
		}
		return true;
	}

	@operator("!=")
	notEqual(t: Hash160): bool {
		return !this.equal(t);
	}

	get bytes(): Bytes {
		return this._value;
	}

	get buffer(): usize {
		return changetype<usize>(this._value.buffer);
	}

	serialize(ds: DataStream): void {
		ds.writeVector<u8>(this._value.toU8Array());
	}

	deserialize(ds: DataStream): void {
		const arr = ds.readVector<u8>();
		this._value = Bytes.fromU8Array(arr);
	}

	key(): string {
		return "";
	}
}

export class Hash256 extends Hash160{
	constructor() {
		super();
		this._len = 32;
	}

	static fromHex(hex: string): Hash256 {
		const hash = new Hash256();
		hash._value = Bytes.fromHex(hex);
		return hash;
	}

	@operator("==")
	equal(t: Hash256): bool {
		for (let i: u32 = 0; i < this._len; i++) {
			if (this._value[i] != t._value[i]) {
				return false
			}
		}
		return true;
	}

	@operator("!=")
	notEqual(t: Hash256): bool {
		return !this.equal(t);
	}
}

export class Hash512 extends Hash160{
	constructor() {
		super();
		this._len = 64;
	}

	static fromHex(hex: string): Hash512 {
		const hash = new Hash512();
		hash._value = Bytes.fromHex(hex);
		return hash;
	}

	@operator("==")
	equal(t: Hash512): bool {
		for (let i: u32 = 0; i < this._len; i++) {
			if (this._value[i] != t._value[i]) {
				return false
			}
		}
		return true;
	}

	@operator("!=")
	notEqual(t: Hash512): bool {
		return !this.equal(t);
	}
}

export class PublicKey extends Hash160{ }

export class Signature implements Serializable{
	_value: Bytes;
	_len: u32 = 96;

	static fromHex(hex: string): Signature {
		const hash = new Signature();
		hash._value = Bytes.fromHex(hex);
		return hash;
	}

	hex(): string {
		return this._value.toHex();
	}

	toString(): string {
		return this._value.toString();
	}

	@operator("==")
	equal(t: Signature): bool {
		for (let i: u32 = 0; i < this._len; i++) {
			if (this._value[i] != t._value[i]) {
				return false
			}
		}
		return true;
	}

	@operator("!=")
	notEqual(t: Signature): bool {
		return !this.equal(t);
	}

	get bytes(): Bytes {
		return this._value;
	}

	get buffer(): usize {
		return changetype<usize>(this._value.buffer);
	}

	serialize(ds: DataStream): void {
		ds.writeVector<u8>(this._value.toU8Array());
	}

	deserialize(ds: DataStream): void {
		const arr = ds.readVector<u8>();
		this._value = Bytes.fromU8Array(arr);
	}

	key(): string {
		return "";
	}
}