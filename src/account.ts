export class Account {

    private _name: number;
    public static isValid(account: number): boolean {
    }


    //核实合约
    public static codeStatus(account: number): string {
       
    }


    public static publicKeyOf(account: number, type: string = 'wif'): string {
    }


    constructor(code: number) {
        this._name = code;
    }
    public get name(): number {
        return this._name;
    }

    /**
     * get the balance of this account, the balance is issued by utrio.token.
     */
    public get balance(): Asset {
    }

    public transfer(to: number, quantity: Asset, memo: string): void {
    }
}