import { Contract, Asset } from "../../index";
import { Account } from "../../src/account";
import { Assert } from "../../src/system";

class accountTest extends Contract {
    @action
    transferTest(): void {

        //transfer test
        let oldBalance = Account.getBalance(this.sender);
        let symbol = oldBalance.symbol;
        let result = Account.transfer(this.sender, this.receiver, oldBalance);
        Assert(result == true, "transfer failed");
        let zeroAsset = new Asset(0, symbol);
        let newBalance = Account.getBalance(this.sender);
        Assert(zeroAsset == newBalance, "asset mismatch");

        //no enough moneycode
        result = Account.transfer(this.sender, this.receiver, new Asset(1, symbol));
        Assert(result == false, "transfer should not success");
    }
}