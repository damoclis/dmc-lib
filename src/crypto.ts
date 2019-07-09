import { sha256, sha512, ripemd160, recoverKey, assertSha256, assertSha512, assertRipemd160, assertRecoverKey } from "../internal/crypto";
import { Assert } from "./system";

export class Crypto {
  static sha256(data: Bytes): Bytes {
    const bytes = new Bytes(32);
    sha256(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static sha512(data: Bytes): Bytes {
    const bytes = new Bytes(64);
    sha512(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static ripemd160(data: Bytes): Bytes {
    const bytes = new Bytes(20);
    ripemd160(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static recoverKey(sign: Bytes): Bytes {
    const pubkey = new Bytes(32);
    recoverKey(changetype<usize>(sign.buffer), sign.length, changetype<usize>(pubkey.buffer), pubkey.length);
    return pubkey;
  }

  static assertSha256(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == 32, `invalid hash length: want 32, got ${hash.length}`);
    assertSha256(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertSha512(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == 64, `invalid hash length: want 64, got ${hash.length}`);
    assertSha512(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertRipemd160(origin: Bytes, hash: Bytes) {
    Assert(hash.length == 20, `invalid hash length: want 20, got ${hash.length}`);
    assertRipemd160(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertRecoverKey(sign: Bytes, pub: Bytes) {
    Assert(sign.length == 64, `invalid signature length: want 64, got ${sign.length}`);
    Assert(pub.length == 32, `invalid public key length: want 32, got ${pub.length}`);
    assertRecoverKey(changetype<usize>(sign.buffer), sign.length, changetype<usize>(pub.buffer), pub.length);
  }
}