import { Contract } from "../../src/contract";
import { Transaction } from "../..";

class TransactionTest extends Contract{
    @action
    getTxHashTest(): Bytes{
        return Transaction.getTxHash();
    }

    @action
    getSinatureTest(): Bytes{
        return Transaction.getSignature();
    }
}