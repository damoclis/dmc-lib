import { Builtin } from "./action";

export const UNIT = 0x0
export const KUNIT = 0x1
export const MUNIT = 0X2
export const DOM = 0x3

export class Asset implements Serializable{

    private amount: u64;
    private symbol: u8;

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


    //算数操作

    //Serilizable interface implements
    serialize(ds:DataStream): void{
        ds.write<u64>(this.amount);
        ds.write<u8>(this.symbol);
    }

    deserialize(ds:DataStream): void{
        this.amount = ds.read<u64>();
        this.symbol = ds.read<u8>();
    }

    key(): string{
        return "";
    }
}