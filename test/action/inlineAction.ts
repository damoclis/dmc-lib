import { Contract } from "dmc-lib";
import { SafeMath } from "dmc-lib";
import { Assert } from "dmc-lib";

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
      result = SafeMath.add(result, b[i]);
    }
    Assert(result == 10, "wrong result from addWithArray action");
  }

  @action
  empty(): void { }
}