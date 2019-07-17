import { prints, printi, printui, printHex } from "../internal/print.d";
import { StringToUsize } from "../lib/codec";

export function Prints(msg: string): void {
  prints(StringToUsize(msg), msg.length);
}

export function Printi(val: i64): void {
  printi(val);
}

export function Printui(val: u64): void {
  printui(val);
}

export function PrintHex(data: Bytes): void {
  printHex(changetype<usize>(data.buffer), data.length);
}