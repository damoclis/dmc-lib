import { Contract } from "../../src/contract";
import { Address } from "../../src/address";
import { HasAuth, RequireAuth, Action, Builtin, BuiltinArray } from "../../src/action";
import { Asset } from "../../src/asset";
import { Assert } from "../../src/system";

class ActionTest extends Contract {
  @action
  hasAuthTest(addr: Address): bool {
    return HasAuth(addr);
  }

  @action
  requireAuthTest(addr: Address): void {
    RequireAuth(addr);
  }

  @action
  callInlineAdd(target: Address): void {
    const action = new Action(target, Asset.zero, "add",
      [Builtin.fromU64(1), Builtin.fromU64(2)]);
    action.send();
  }

  @action
  callFailedInlineAdd(target: Address): void {
    const action = new Action(target, Asset.zero, "add",
      [Builtin.fromU32(1), Builtin.fromU32(2)]);
    action.send();
  }

  @action
  callInlineAddWithArr(target: Address): void {
    const action = new Action(target, Asset.zero, "addWithArray",
      [Builtin.fromU64(1), [Builtin.fromU64(2), Builtin.fromU64(3), Builtin.fromU64(4)]])
    action.send();
  }

  @action
  callWithValue(target: Address): void {
    const oldBalance = target.getBalance();
    const amount = new Asset(1)
    const action = new Action(target, amount, "empty");
    action.send();

    const newBalance = target.getBalance();
    Assert(newBalance - oldBalance == amount, "transfer failed");
  }

  @action
  callDeploy(target: Address): void {
    const action = new Action(target, Asset.zero, "__DEPLOY__");
    action.send();
  }
}