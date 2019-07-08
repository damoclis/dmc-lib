export class NameEx{
    valueH: number;
    valueL: number;

    constructor(h: u32, l: number) {
        this.valueH = h;
        this.valueL = l;
    }
}

export class Contract {

    protected _receiver: number;
    private _currentActionName: NameEx;

    constructor(receiver: number) {
        this._receiver = receiver;
    }
    /**
     * The receiver of a contract, normally it's the account name which the contract deployed to.
     */
    public get receiver(): number {
        return this._receiver;
    }

    public get action(): NameEx {
        return this._currentActionName;
    }

    public setActionName(actH: number, actL: number): void {
        this._currentActionName = new NameEx(actH, actL);
    }
}
