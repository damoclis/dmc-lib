import { Address } from "./address";
import { getSelf, getSender, getReciver } from "../internal/account.d";
import { Account } from "./account";
import { Action } from "./action";
import { Transaction } from "./transaction";

export class Contract {
    sender: Address;
    receiver: Address;
    contract: Address;
    actionName: string;

    constructor() {
        let _contract = new Bytes(20);
        getSelf(changetype<usize>(_contract.buffer));
        this.contract = new Address(_contract);
        let _sender = new Bytes(20);
        getSender(changetype<usize>(_sender.buffer));
        this.sender = new Address(_sender);
        let _receiver = new Bytes(20);
        getReciver(changetype<usize>(_receiver.buffer));
        this.receiver = new Address(_receiver);
        this.actionName = Action.getActionName();
    }

    isAction(actionName: string): bool {
        return actionName == this.actionName;
    }

    getDataStream(): DataStream {
        return Action.getActionData();
    }

    // static get txHash() {
    //     return Transaction.getTxHash();
    // }


}