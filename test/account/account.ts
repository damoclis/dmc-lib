import { Contract, Asset } from "../../index";
import { Account } from "../../src/account";
import { Assert } from "../../src/system";
import { Address } from "../../src/address";

class accountTest extends Contract {
    @action
    transferTest(from: Address, to: Address): void {

        //transfer test
        let oldBalance = from.getBalance();
        let symbol = oldBalance.symbol;
        let result = Account.transfer(from, to, oldBalance);
        Assert(result == true, from.hex() + " transfer failed");
        let zeroAsset = new Asset(0, symbol);
        let newBalance = from.getBalance();
        Assert(zeroAsset == newBalance, "asset mismatch");

        //no enough moneycode
        result = Account.transfer(from, to, new Asset(1, symbol));
        Assert(result == false, "transfer should not success");
    }
}