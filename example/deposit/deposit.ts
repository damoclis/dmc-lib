import { Contract } from "../../src/contract";
import { Address } from "../../src/address";
import { Asset } from "../../src/asset";
import { Database } from "../../src/database";
import { RequireAuth } from "../../src/action";
import { Chain } from "../../src/chain";
import { Assert } from "../../src/system";

@database("pool")
class Deposit implements Serializable {
  @key
  address: Address
  prevMoney: Asset
  money: Asset
  latestHeight: u64
}

class DepositManager extends Contract {
  _table: string = "pool"
  _db: Database<Deposit>

  constructor() {
    super();
    this._db = new Database<Deposit>(this.self, this._table);
  }

  @action
  getDeposit(addr: Address): Asset {
    const currHeight = Chain.getBlockHeight();
    const deposit = this._db.get(addr.toString());
    if (deposit.address == null) {
      return Asset.zero;
    }

    if (deposit.latestHeight <= currHeight) {
      return deposit.money;
    } else {
      return deposit.prevMoney;
    }
  }

  @action
  deposit(addr: Address, money: Asset): void {
    RequireAuth(addr);
    const deposit = this._db.get(addr.toString());
    if (deposit.address == null) {
      return;
    }

    if (money != deposit.money) {
      // redeem the deposit
      Assert(this.self.transfer(addr, deposit.money), "redeem deposit failed");
      // transfer to deposit pool
      Assert(addr.transfer(this.self, money), "balance not enough for deposit");
      deposit.latestHeight = Chain.getBlockHeight();
      deposit.prevMoney = deposit.money;
      deposit.money = money;
    }
  }
}