import { Contract } from "../../../src/contract";
import { Action } from "../../../src/action";

class Fibonacci extends Contract {
    @action
    compute(n: u64): u64 {
        if (n <= 2) {
            return 1;
        }
        let a: u64 = 1;
        let b: u64 = 1;
        let c: u64=0;
        for (let i:u64 = 3; i <= n; c = a + b, a = b, b = c, i++);
        return c;
    }

    @action
    computeRecurrence(n: u64): u64{
        if (n <= 2) {
            return 1;
        }
        return this.computeRecurrence(n - 1) + this.computeRecurrence(n - 2);
    }

}