import { Contract } from "../../src/contract";
import { SafeMath } from "../../lib/safeMath";
import { Assert } from "../../src/system";

class InlineActionTest extends Contract {
  @action
  add(a: u64, b: u64): void {
    // a = 1, b = 2
    Assert(SafeMath.add(a, b) == 3, "wrong result from add action");
  }

  @action
  addWithArray(a: u64, b: u64[]): void {
    // a = 1, b = [2,3,4]
    let result = a;
    for (let i = 0; i < b.length; i++) {
      result = SafeMath.add(a, b[i]);
    }
    Assert(result == 10, "wrong result from addWithArray action");
  }

  @action
  empty(): void { }
}