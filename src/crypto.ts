import { sha256, sha512, ripemd160, recoverKey, assertSha256, assertSha512, assertRipemd160, assertRecoverKey } from "../internal/crypto.d";
import { Assert } from "./system";
import { PUBLIC_KEY_LEN, SIGNATURE_LEN, SHA256_LEN, SHA512_LEN, RIPEMD160_LEN } from "../lib/constant";

export class Crypto {
  static sha256(data: Bytes): Bytes {
    const bytes = new Bytes(SHA256_LEN);
    sha256(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static sha512(data: Bytes): Bytes {
    const bytes = new Bytes(SHA512_LEN);
    sha512(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static ripemd160(data: Bytes): Bytes {
    const bytes = new Bytes(RIPEMD160_LEN);
    ripemd160(changetype<usize>(data.buffer), data.length, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static recoverKey(sign: Bytes): Bytes {
    const pubkey = new Bytes(PUBLIC_KEY_LEN);
    recoverKey(changetype<usize>(sign.buffer), sign.length, changetype<usize>(pubkey.buffer), pubkey.length);
    return pubkey;
  }

  static assertSha256(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == SHA256_LEN, `invalid hash length: want ${SHA256_LEN}, got ${hash.length}`);
    assertSha256(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertSha512(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == SHA512_LEN, `invalid hash length: want ${SHA512_LEN}, got ${hash.length}`);
    assertSha512(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertRipemd160(origin: Bytes, hash: Bytes):void{
    Assert(hash.length == RIPEMD160_LEN, `invalid hash length: want ${RIPEMD160_LEN}, got ${hash.length}`);
    assertRipemd160(changetype<usize>(origin.buffer), origin.length, changetype<usize>(hash.buffer));
  }

  static assertRecoverKey(sign: Bytes, pub: Bytes):void{
    Assert(sign.length == SIGNATURE_LEN, `invalid signature length: want ${SIGNATURE_LEN}, got ${sign.length}`);
    Assert(pub.length == PUBLIC_KEY_LEN, `invalid public key length: want ${PUBLIC_KEY_LEN}, got ${pub.length}`);
    assertRecoverKey(changetype<usize>(sign.buffer), sign.length, changetype<usize>(pub.buffer), pub.length);
  }
}