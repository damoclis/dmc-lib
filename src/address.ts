import { StringToBytes, BytesToString } from "../lib/codec";

export class Address {
	_value: Uint8Array;
	_len: u32 = 20;

	static from(hex: string): Address {
		if (hex.substr(0, 2) == "0x") {
			hex = hex.substr(2);
		}
		return new Address(StringToBytes(hex));
	}

	constructor(raw: Uint8Array) {
		if (raw.length > 20) {
			raw = raw.subarray(0, 20);
		}
		this._value = raw;
	}

	hex(): string {
		return BytesToString(this._value);
	}

	equal(t: Address): bool {
		for (let i = 0; i < this._len; i++) {
			if (this._value[i] !== t._value[i]) {
				return false
			}
		}
		return true;
	}

	get buffer(): usize {
		return changetype<usize>(this._value.buffer);
	}
}