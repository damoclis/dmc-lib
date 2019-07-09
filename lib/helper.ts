export function Hex(b: Bytes): string {
  let hex = "";
  const rb = SwapEndian(b);
  rb.forEach(function (byte: u8): void {
    hex += byte.toString(16);
  });
  return "0x" + hex;
}

export function HexToBytes(hex: string): Bytes {
  if (hex.substr(0, 2) == "0x") {
    hex = hex.substr(2);
  }

  let len = hex.length % 2 == 0 ? hex.length / 2 : hex.length / 2 + 1
  let bytes = new Bytes(len);
  let i = 0;
  while (hex.length) {
    let shex = hex.substr(0, 2);
    bytes[i++] = parseInt(shex, 16);
    hex = hex.substr(2);
  }

  return SwapEndian(bytes)
}

export function SwapEndian(bytes: Bytes): Bytes {
  let clone = CloneBytes(bytes);
  return clone.reverse()
}

export function U8ArrayToBytes(arr: Array<u8>): Bytes {
  let bytes = new Bytes(arr.length);
  arr.forEach(function (item: u8, i: i32): void {
    bytes[i] = item;
  })
  return bytes;
}

export function CloneBytes(bytes: Bytes): Bytes {
  let clone = new Bytes(bytes.length);
  bytes.forEach(function (item: u8, i: i32): void {
    clone[i] = item;
  })
  return clone;
}

export function WriteBytesToU8Array(bytes: Bytes, buffer: Array<u8>): void {
  bytes.forEach(function (item: u8): void {
    buffer.push(item)
  })
}

// Concat two different bytes and returns a new bytes.
export function ConcatBytes(b1: Bytes, b2: Bytes): Bytes {
  const newBytes = new Array<u8>();
  b1.forEach(function (item: u8): void {
    newBytes.push(item);
  })
  b2.forEach(function (item: u8): void {
    newBytes.push(item);
  })

  return U8ArrayToBytes(newBytes);
}