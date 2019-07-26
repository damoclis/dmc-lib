import { Contract } from "../../src/contract";
import { Chain } from "../../src/chain";

class ChainTest extends Contract {
  blockHeight: u64 = 0;

  @action
  getBlockHeightTest(): u64{
    this.blockHeight = Chain.getBlockHeight();
    return this.blockHeight;
  }

  @action
  getBlockHashTest(): Bytes{
    return Chain.getBlockHash(this.blockHeight);
  }
}