@external("damoclis", "prints")
export declare function prints(str: usize, len: u32): void;

@external("damoclis", "printi")
export declare function printi(val: i64): void;

@external("damoclis", "printui")
export declare function printui(val: u64): void;

@external("damoclis", "printHex")
export declare function printHex(data: usize, len: u32): void;