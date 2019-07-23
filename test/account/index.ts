import { Contract, Asset } from "../../index";
import { Account } from "../../src/account";

class accountTest extends Contract{
    @action
    transferTest(): void{

        //transfer test
        let amount = Account.getBalance(this.sender);
        let result = Account.transfer(this.sender, this.receiver, amount);
        assert(result == true);
        let zeroAsset = new Asset(0,amount.symbol);
        assert(zeroAsset == amount);

        //no enough money
        result = Account.transfer(this.sender, this.receiver, amount);
        assert(result == false);
    }    
}