export function StringToBytes(str: string): Uint8Array {
  const enc = new TextEncoder();
  return enc.encode(str);
}

export function BytesToString(bytes: Uint8Array): string {
  const dec = new TextDecoder();
  return dec.decode(bytes);
}

export function StringToUsize(str: string): usize {
  return changetype<usize>(StringToBytes(str).buffer);
}