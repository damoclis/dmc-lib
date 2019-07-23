import { Contract, Asset } from "../../index";
import { Account } from "../../src/account";

class accountTest extends Contract{
    @action
    getSenderBalance(): Asset{
        let sender = this.sender;
        return Account.getBalance(sender);
    }

    @action
    transferToReceiver(): bool{
        let value= new Asset(100);
        return Account.transfer(this.sender, this.receiver, value);
    }
}