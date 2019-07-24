import { damoAssert, damoExit, now, genesisTime } from "../internal/system.d";
import { StringToUsize } from "../lib/codec";

export function Assert(test: bool, msg: string): void {
  damoAssert(test, StringToUsize(msg), msg.length);
}

export function AssertExit(test: bool, code: i32): void {
  damoExit(test, code)
}

export function Now(): u64 {
  return now();
}

export function GenesisTime(): u64 {
  return genesisTime();
}