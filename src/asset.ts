import { Builtin } from "./action";
import { SafeMath } from "../lib/safeMath";

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

    isSymbolValid(): bool {
        return this.symbol == UNIT || this.symbol == KUNIT || this.symbol == MUNIT || this.symbol == DOM;
    }

    //算数操作
    @operator(">")
    gt(r: Asset): bool {
        return this.symbol == r.symbol && this.amount > r.amount;
    }

    @operator(">=")
    gte(r: Asset): bool {
        return this.symbol == r.symbol && this.amount >= r.amount;
    }

    @operator("<")
    lt(r: Asset): bool {
        return this.symbol == r.symbol && this.amount < r.amount;
    }

    @operator("<=")
    lte(r: Asset): bool {
        return this.symbol == r.symbol && this.amount <= r.amount;
    }

    @operator("==")
    eq(r: Asset): bool {
        return this.symbol == r.symbol && this.amount == r.amount;
    }

    @operator("!=")
    uq(r: Asset): bool {
        return this.symbol == r.symbol && this.amount != r.amount;
    }

    @operator("+")
    add(r: Asset): Asset {
        assert(r.symbol == this.symbol, "Asset with different symbols!");
        this.amount = SafeMath.add(this.amount , r.amount);
        return this;
    }
    
    @operator("-")
    sub(r: Asset): Asset {
        assert(r.symbol == this.symbol, "Asset with different symbols!");
        assert(r.amount <= this.symbol, "Asset amount not enough!");
        this.amount = SafeMath.sub(this.amount , r.amount);
        return this;
    }

    @operator("*")
    multi(r: u64): Asset {
        this.amount = SafeMath.mul(this.amount , r);
        return this;
    }
    
    @operator("/")
    divide(r: u64): Asset {
        this.amount = SafeMath.div(this.amount , r);
        return this;
    }


    //Serilizable interface implements
    serialize(ds: DataStream): void {
        ds.write<u64>(this.amount);
        ds.write<u8>(this.symbol);
    }

    deserialize(ds: DataStream): void {
        this.amount = ds.read<u64>();
        this.symbol = ds.read<u8>();
    }

    key(): string {
        return "";
    }
}