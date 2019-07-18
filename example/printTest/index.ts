import { Contract } from "../../index";
import { Prints } from "../../index";
import { Printi, Printui } from "../../index";
import { PrintHex } from "../../index";


class printTest extends Contract{
    @action
    printActionName(): void{
        Prints(this.actionName);
    }

    @action
    printStr(msg: string): void{
        Prints(msg);
    }

    @action
    printInt(a: i64, b: u64): void{
        Printi(a);
        Printui(b);
    }

    @action
    printAddr(): void{
        PrintHex(this.contract.bytes);
        PrintHex(this.receiver.bytes);
        PrintHex(this.sender.bytes);
    }

}