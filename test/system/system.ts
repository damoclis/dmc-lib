import { Contract } from "../../src/contract";
import { Now, GenesisTime, AssertExit } from "../../src/system";

class SystemTest extends Contract{
    @action
    nowTest(): u64{
        return Now();
    }

    @action
    genesisTimeTest(): u64{
        return GenesisTime();
    }

    //expected normal running
    @action
    assertExitTestTrue(): void{
        AssertExit(1 == 1, 1);
    }

    //expected program exit
    @action
    assertExitTestFalse(): void{
        AssertExit(1 == 2, 2);
    }
}