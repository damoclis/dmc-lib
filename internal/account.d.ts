@external("damoclis", "getBalance")
export declare function getBalance(addr: usize, buffer: usize, len: u32): u32;

@external("damoclis", "getSelf")
export declare function getSelf(result: usize): void;

@external("damoclis", "getSender")
export declare function getSender(result: usize): void;

@external("damoclis", "getReceiver")
export declare function getReceiver(result: usize): void;

@external("damoclis", "transfer")
export declare function transfer(from: usize, to: usize, value: usize, valLen: u32): bool