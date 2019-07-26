import { Contract } from "../../src/contract";
import { Transaction } from "../../src/transaction";

class TransactionTest extends Contract {
    @action
    getTxHashTest(): Bytes {
        return Transaction.getTxHash();
    }

    @action
    getSignatureTest(): Bytes {
        return Transaction.getSignature();
    }
}