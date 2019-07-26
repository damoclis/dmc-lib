import { getTxHash, getSignature } from "../internal/transaction.d";
import { SIGNATURE_LEN, SHA256_LEN } from "../lib/constant";

export class Transaction {
  static getTxHash(): Bytes {
    let bytes = new Bytes(SHA256_LEN);
    getTxHash(changetype<usize>(bytes.buffer));
    return bytes;
  }

  static getSignature(): Bytes {
    let bytes = new Bytes(SIGNATURE_LEN);
    getSignature(changetype<usize>(bytes.buffer));
    return bytes;
  }
}