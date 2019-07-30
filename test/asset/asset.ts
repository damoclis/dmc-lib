import { Contract } from "../../src/contract";
import { Asset } from "../../src/asset";
import {Assert} from "../../src/system"

class AssetTest extends Contract {
    asset1: Asset = new Asset(1);
    asset2: Asset = new Asset(2);
    asset100: Asset = new Asset(100);
    asset200: Asset = new Asset(200);
    asset1000: Asset = new Asset(1000);

    @action
    compareTest(): void{
        Assert(this.asset1 < this.asset100, "< wrong");
        Assert(this.asset1 <= this.asset100, "<= wrong");
        Assert(this.asset100 <= this.asset100, "<= wrong");

        Assert(this.asset1000 > this.asset100, "> wrong");
        Assert(this.asset1000 >= this.asset100, ">= wrong");
        Assert(this.asset1000 >= this.asset1000, ">= wrong");

        Assert(this.asset1 == this.asset1, "== wrong");
        Assert(this.asset100 != this.asset1000, "!=wrong");
    }

    @action
    mathTest(): void{
        Assert(this.asset1 + this.asset1 == this.asset2, "add wrong");
        Assert(this.asset2 - this.asset1 == this.asset1, "sub wrong");
        Assert(this.asset2 * 100 == this.asset200*1, "mul wrong");
        Assert(this.asset200 / 100==this.asset2, "div wrong");
    }

}