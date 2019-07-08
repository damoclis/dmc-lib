@external("damoclis", "damoAssert")
export declare function damoAssert(test: bool, msg: usize, msgLen: u32): void

@external("damoclis", "damoExit")
export declare function damoExit(test: bool, code: i32): void;
