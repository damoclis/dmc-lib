export function Hex(b: Bytes): string {
  let hex = "";
  b.forEach(function (byte: u8): void {
    hex += byte.toString(16);
  });
  return "0x" + hex;
}