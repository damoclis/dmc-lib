import { Contract } from "../../src/contract";


class Person implements Serializable{
    name: string;
    id: string;
    age: u64;
}

class MyContract extends Contract{

}