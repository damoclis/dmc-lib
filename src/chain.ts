import { SHA256_LEN } from "../lib/constant";
import { getBlockHash, getBlockHeight } from "../internal/chain.d";

export class Chain {
  static getBlockHash(height: u64): Bytes {
    const bytes = new Bytes(SHA256_LEN);
    getBlockHash(height, changetype<usize>(bytes.buffer));
    return bytes;
  }

  static getBlockHeight(): u64 {
    return getBlockHeight();
  }
}