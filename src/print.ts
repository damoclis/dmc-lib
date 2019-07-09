import { prints, printi, printui, printHex } from "../internal/print";
import { StringToUsize } from "../lib/codec";

export class Print {
  static prints(msg: string): void {
    prints(StringToUsize(msg), msg.length);
  }

  static printi(val: i64): void {
    printi(val);
  }

  static printui(val: u64): void {
    printui(val);
  }

  static printHex(data: Bytes): void {
    printHex(changetype<usize>(data.buffer), data.length);
  }
}