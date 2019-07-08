export class Asset{

    private amount: u64;
    private symbol: u64;

    constructor(amt: u64 = 0, sy: u64 = 0x5341475504) { // 0x5341475504 means "StingToSymbol(4, UGAS)"
        this._amount = amt;
        this._symbol = sy;
    }

    isSymbolValid(): boolean {
    }

    public static balanceOf(account: account_name): Asset {
    }

    public static transfer(from: account_name, to: account_name, value: Asset): void {
    }

    //算数操作
    
}