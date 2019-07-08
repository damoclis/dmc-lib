import { damoAssert, damoExit } from "../internal/system";
import { StringToUsize } from "../lib/codec";

export function Assert(test: bool, msg: string): void {
  damoAssert(test, StringToUsize(msg), msg.length);
}

export function AssertExit(test: bool, code: i32): void {
  damoExit(test, code)
}