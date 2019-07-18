export class Address implements Serializable {
	_value: Bytes;
	_len: u32 = 20;

	static from(hex: string): Address {
		return new Address(Bytes.fromHex(hex));
	}

	constructor(raw: Bytes) {
		if (raw.length > 20) {
			raw = <Bytes>(<Uint8Array>raw.subarray(0, 20));
		}
		this._value = raw;
	}

	hex(): string {
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

	bytes(): Bytes {
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