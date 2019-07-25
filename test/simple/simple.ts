import { Contract } from "../../src/contract";
import { Prints } from "../../src/print";

class SimpleTest extends Contract {
  @action
  hi(): void {
    Prints("Hello world");
  }

  @action
  add(a: u64, b: u64[]): void {

  }
}