import { Builtin } from "./action";

export const UNIT = 0x0
export const KUNIT = 0x1
export const MUNIT = 0X2
export const DOM = 0x3

export class Asset implements Serializable {

    amount: u64;
    symbol: u8;

    constructor(amt: u64 = 0, sy: u8 = DOM) {
        this.amount = amt;
        this.symbol = sy;
    }

    bytes(): Bytes {
        const raw = this.raw();
        return Builtin.fromU64(this.amount).bytes();
    }

    raw(): u64 {
        let amount = this.amount
        if (this.symbol == KUNIT) {
            amount *= 1000
        } else if (this.symbol == MUNIT) {
            amount *= 1000 * 1000
        } else if (this.symbol == DOM) {
            amount *= 1000 * 1000 * 100
        }
        return amount
    }

    isSymbolValid(): boolean {
        return this.symbol == UNIT || this.symbol == KUNIT || this.symbol == MUNIT || this.symbol == DOM;
    }

    public static balanceOf(account: account_name): Asset {
    }

    public static transfer(from: account_name, to: account_name, value: Asset): void {
    }

    serialize(ds: DataStream): void {

    }

    //算数操作

}