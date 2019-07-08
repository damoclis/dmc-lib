@external("damoclis", "sha256")
export declare function sha256(data: usize, size: u32, output: usize): void;

@external("damoclis", "sha512")
export declare function sha512(data: usize, size: u32, output: usize): void;

@external("damoclis", "ripemd160")
export declare function ripemd160(data: usize, size: u32, output: usize): void;

@external("damoclis", "recoverKey")
export declare function recoverKey(sign: usize, signLen: u32, outputPub: usize, outputLen: u32): void;

@external("damoclis", "assertSha256")
export declare function assertSha256(data: usize, size: u32, msg: usize): void;

@external("damoclis", "assertSha512")
export declare function assertSha512(data: usize, size: u32, msg: usize): void;

@external("damoclis", "assertRipemd160")
export declare function assertRipemd160(data: usize, size: u32, msg: usize): void;

@external("damoclis", "assertRecoverKey")
export declare function assertRecoverKey(sign: usize, signLen: u32, pub: usize, pubLen: u32): void;