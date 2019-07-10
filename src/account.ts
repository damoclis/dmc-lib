import { Address } from "./address";
import { Asset } from "./asset";
import { getBalance, transfer } from "../internal/account";

export class Account {
    static getBalance(addr: Address): Asset{
        let asset: Asset = new Asset();
        let size = getBalance(addr.buffer, 0, 0);
        let bytes = new Bytes(size);
        let ds = new DataStream(changetype<usize>(bytes.buffer), size);
        getBalance(addr.buffer, ds.buffer, size);
        asset.deserialize(ds);
        return asset;
    }

    static transfer(from: Address, to: Address, value: Asset): bool{
        let size = DataStream.measure<Asset>(value);
        let bytes = new Bytes(size);
        let ds = new DataStream(changetype<usize>(bytes.buffer), size);
        value.serialize(ds);
        return transfer(from.buffer, to.buffer, ds.buffer, size);
    }
}