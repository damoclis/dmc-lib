import { StringToBytes, BytesToString } from "../lib/codec";
import { HexToBytes } from "../lib/helper";

export class Address {
	_value: Bytes;
	_len: u32 = 20;

	static from(hex: string): Address {
		return new Address(HexToBytes(hex));
	}

	constructor(raw: Bytes) {
		if (raw.length > 20) {
			raw = raw.subarray(0, 20);
		}
		this._value = raw;
	}

	hex(): string {
		return BytesToString(this._value);
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
}