class Simple {
  val: u64


  constructor(v: u64) {
    this.val = v;
  }

  add(a: u64, b: u64): u64 {
    return a + b
  }
}

const s = new Simple(1);
s.add(1, 2);