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
		for (let i = 0; i < this._len; i++) {
			if (this._value[i] !== t._value[i]) {
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