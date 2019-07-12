import { getTxHash, getSignature } from "../internal/transaction.d";

export class Transaction {
  static getTxHash(): Bytes {
    let bytes = new Bytes(32);
    getTxHash(changetype<usize>(bytes.buffer));
    return bytes;
  }

  static getSignature(): Bytes {
    let bytes = new Bytes(64);
    getSignature(changetype<usize>(bytes.buffer));
    return bytes;
  }
}