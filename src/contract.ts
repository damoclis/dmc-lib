import { Address } from "./address";
import { getSelf, getSender, getReciver } from "../internal/account";
import { Account } from "./account";
import { Action } from "./action";
import { Transaction } from "./transaction";

export class Contract{
    sender: Address;
    receiver: Address;
    contract: Address;

    constructor() {
        let raw = new Bytes(20);
        getSelf(changetype<usize>(raw.buffer));
        this.contract = new Address(raw);
        getSender(changetype<usize>(raw.buffer));
        this.sender = new Address(raw);
        getReciver(changetype<usize>(raw.buffer));
        this.receiver = new Address(raw);
    }

    isAction(actionName: string):bool{
        let actionNow = Action.getActionName();
        return actionName == actionNow;
    }

    getDataStream(): DataStream{
        return Action.getActionData();
    }

    // static get txHash() {
    //     return Transaction.getTxHash();
    // }


}