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
  return bytes.subarray().reverse()
}