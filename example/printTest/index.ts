import { Contract } from "../../index";
import { Prints } from "../../index";
import { Printi, Printui } from "../../index";
import { PrintHex } from "../../index";

@database("aaa")
class Person{
    age: u64 = 0;
    
    serialize(ds: DataStream) :void{
        ds.write<u64>(this.age);
    }

    deserialize(ds:DataStream):void {
        this.age = ds.read<u64>();
    }

    key():string {
        return "";
    }

}

class printTest extends Contract{
    @action
    printActionName(a:Person): void{
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