import { Contract } from "../../src/contract";
import { Crypto } from "../../src/crypto";
import { Assert } from "../../src/system";
import { SHA256_LEN, SHA512_LEN, RIPEMD160_LEN } from "../../lib/constant";

class CryptoTest extends Contract {
  @action
  hashTest(data: Bytes): void {
    const sha256 = Crypto.sha256(data);
    const sha512 = Crypto.sha512(data);
    const ripemd160 = Crypto.ripemd160(data);

    Assert(sha256.length == SHA256_LEN, "sha256 length should be 32");
    Assert(sha512.length == SHA512_LEN, "sha512 length should be 64");
    Assert(ripemd160.length == RIPEMD160_LEN, "ripemd160 length should be 20");

    Crypto.assertSha256(data, sha256);
    Crypto.assertSha512(data, sha512);
    Crypto.assertRipemd160(data, ripemd160);
  }

  @action
  recoverKeyTest(sign: Bytes): void {
    const pubkey = Crypto.recoverKey(sign);
    Crypto.assertRecoverKey(sign, pubkey);
  }
}