import { Builtin } from "./action";
import { SafeMath } from "../lib/safeMath";
import { Assert } from "./system";

export const UNIT: u8 = 0x0
export const KUNIT: u8 = 0x1
export const MUNIT: u8 = 0X2
export const DOM: u8 = 0x3

export class Asset implements Serializable {

    amount: u64;

    static get zero(): Asset {
        return new Asset();
    }

    constructor(amt: u64 = 0, sy: u8 = UNIT) {
        if (sy == KUNIT) {
            amt *= 1000
        } else if (sy == MUNIT) {
            amt *= 1000 * 1000
        } else if (sy == DOM) {
            amt *= 1000 * 1000 * 100
        }
        this.amount = amt;
    }

    get bytes(): Bytes {
        const raw = this.amount;
        const ds = Builtin.fromU64(this.amount);
        return Bytes.fromU8Array(ds.datastream.toArray<u8>());
    }

    //算数操作
    @operator(">")
    gt(r: Asset): bool {
        return this.amount > r.amount;
    }

    @operator(">=")
    gte(r: Asset): bool {
        return this.amount >= r.amount;
    }

    @operator("<")
    lt(r: Asset): bool {
        return this.amount < r.amount;
    }

    @operator("<=")
    lte(r: Asset): bool {
        return this.amount <= r.amount;
    }

    @operator("==")
    eq(r: Asset): bool {
        return this.amount == r.amount;
    }

    @operator("!=")
    uq(r: Asset): bool {
        return this.amount != r.amount;
    }

    @operator("+")
    add(r: Asset): Asset {
        const amount = SafeMath.add(this.amount, r.amount);
        return new Asset(amount);
    }

    @operator("-")
    sub(r: Asset): Asset {
        Assert(r.amount <= this.amount, "Asset amount not enough!");
        const amount = SafeMath.sub(this.amount, r.amount);
        return new Asset(amount);
    }

    @operator("*")
    multi(r: u64): Asset {
        const amount = SafeMath.mul(this.amount, r);
        return new Asset(amount);
    }

    @operator("/")
    divide(r: u64): Asset {
        const amount = SafeMath.div(this.amount, r);
        return new Asset(amount);
    }


    //Serilizable interface implements
    serialize(ds: DataStream): void {
        ds.write<u64>(this.amount);
    }

    deserialize(ds: DataStream): void {
        this.amount = ds.read<u64>();
    }

    key(): string {
        return "";
    }
}