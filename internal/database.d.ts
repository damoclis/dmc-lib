@external("damoclis", "dbGet")
export declare function dbGet(contract: usize, table: usize, tableLen: u32, key: usize, keyLen: u32, buffer: usize, len: u32): u32;

@external("damoclis", "dbStore")
export declare function dbStore(table: usize, tableLen: u32, key: usize, keyLen: u32, buffer: usize, len: u32): void;

@external("damoclis", "dbUpdate")
export declare function dbUpdate(table: usize, tableLen: u32, key: usize, keyLen: u32, buffer: usize, len: u32): void;

@external("damoclis", "dbIterator")
export declare function dbIterator(contract: usize, table: usize, tableLen: u32): i32;

@external("damoclis", "dbNext")
export declare function dbNext(contract: usize, table: usize, tablelen: u32, itr: i32): i32;

@external("damoclis", "dbRetrieve")
export declare function dbRetrieve(contract: usize, table: usize, tableLen: u32, itr: i32, value: usize, valueLen: u32): u32;

@external("damoclis", "dbRemove")
export declare function dbRemove(table: usize, tableLen: u32, key: usize, keyLen: u32): void;
