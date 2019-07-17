import { Address } from "./address";
import { Asset } from "./asset";
import { getBalance, transfer } from "../internal/account.d";
import { CreateDataStream } from "../lib/helper";

export class Account {
    static getBalance(addr: Address): Asset {
        let asset: Asset = new Asset();
        let size = getBalance(addr.buffer, 0, 0);
        let ds = CreateDataStream(size);
        getBalance(addr.buffer, ds.buffer, ds.len);
        asset.deserialize(ds);
        return asset;
    }

    static transfer(from: Address, to: Address, value: Asset): bool {
        let size = DataStream.measure<Asset>(value);
        let ds = CreateDataStream(size);
        value.serialize(ds);
        return transfer(from.buffer, to.buffer, ds.buffer, size);
    }
}