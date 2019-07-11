import { sha256, sha512, ripemd160, recoverKey, assertSha256, assertSha512, assertRipemd160, assertRecoverKey } from "../internal/crypto";
import { Assert } from "./system";
import { PUBLIC_KEY_LEN, SIGNATURE_LEN, SHA256_LEN, SHA512_LEN, RIPEMD160_LEN } from "../lib/constant";
import { U8ArrayToBytes, BytesToU8Array, CreateDataStream, WrapDataStream } from "../lib/helper";

export class Crypto {
  static sha256(data: Bytes): Bytes {
    const input = WrapDataStream(data)
    const output = CreateDataStream(SHA256_LEN)
    sha256(input.buffer, input.len, output.buffer);
    return U8ArrayToBytes(output.readVector<u8>())
  }

  static sha512(data: Bytes): Bytes {
    const input = WrapDataStream(data)
    const output = CreateDataStream(SHA512_LEN)
    sha512(input.buffer, input.len, output.buffer);
    return U8ArrayToBytes(output.readVector<u8>());
  }

  static ripemd160(data: Bytes): Bytes {
    const input = WrapDataStream(data);
    const output = CreateDataStream(RIPEMD160_LEN);
    ripemd160(input.buffer, input.len, output.buffer);
    return U8ArrayToBytes(output.readVector<u8>());
  }

  static recoverKey(sign: Bytes): Bytes {
    const input = WrapDataStream(sign);
    const output = CreateDataStream(PUBLIC_KEY_LEN);
    recoverKey(input.buffer, input.len, output.buffer, output.len);
    return U8ArrayToBytes(output.readVector<u8>());
  }

  static assertSha256(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == SHA256_LEN, `invalid hash length: want ${SHA256_LEN}, got ${hash.length}`);
    const originInput = WrapDataStream(origin);
    const hashInput = WrapDataStream(hash);
    assertSha256(originInput.buffer, originInput.len, hashInput.buffer));
  }

  static assertSha512(origin: Bytes, hash: Bytes): void {
    Assert(hash.length == SHA512_LEN, `invalid hash length: want ${SHA512_LEN}, got ${hash.length}`);
    const originInput = WrapDataStream(origin);
    const hashInput = WrapDataStream(hash);
    assertSha512(originInput.buffer, originInput.len, hashInput.buffer);
  }

  static assertRipemd160(origin: Bytes, hash: Bytes) {
    Assert(hash.length == RIPEMD160_LEN, `invalid hash length: want ${RIPEMD160_LEN}, got ${hash.length}`);
    const originInput = WrapDataStream(origin);
    const hashInput = WrapDataStream(hash);
    assertRipemd160(originInput.buffer, originInput.len, hashInput.buffer);
  }

  static assertRecoverKey(sign: Bytes, pub: Bytes) {
    Assert(sign.length == SIGNATURE_LEN, `invalid signature length: want ${SIGNATURE_LEN}, got ${sign.length}`);
    Assert(pub.length == PUBLIC_KEY_LEN, `invalid public key length: want ${PUBLIC_KEY_LEN}, got ${pub.length}`);
    const signInput = WrapDataStream(sign);
    const pubInput = WrapDataStream(pub);
    assertRecoverKey(signInput.buffer, signInput.len, pubInput.buffer, pubInput.len);
  }
}