@external("damoclis", "damoAssert")
export declare function damoAssert(test: bool, msg: usize, msgLen: u32): void

@external("damoclis", "damoExit")
export declare function damoExit(test: bool, code: i32): void;

/**
 * now returns the timestamp in microseconds of current time.
 */
@external("damoclis", "now")
export declare function now(): u64;

@external("damoclis", "genesisTime")
export declare function genesisTime(): u64;