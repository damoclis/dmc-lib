@external("damoclis", "hasAuth")
export declare function hasAuth(addr: usize): bool

@external("damoclis", "requireAuth")
export declare function requireAuth(addr: usize): void;

@external("damoclis", "callAction")
export declare function callAction(serialized_action: usize, size: u32): void;

@external("damoclis", "getActionName")
export declare function getActionName(buffer: usize, len: u32): u32;

@external("damoclis", "getActionData")
export declare function getActionData(buffer: usize, len: u32): u32;

@external("damoclis", "getValue")
export declare function getValue(buffer: usize, len: u32): u32;

@external("damoclis", "returnData")
export declare function returnData(buffer: usize, len: u32): void;

@external("damoclis", "returnU64")
export declare function returnU64(val: u64): void;