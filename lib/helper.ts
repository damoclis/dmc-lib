export function Hex(b: Bytes): string {
  let hexTable = "0123456789abcdef".split('');
  let hex = "";
  let rb = SwapEndian(b)
  for (let i = 0; i < rb.length; i++) {
    let byte: u8 = rb[i];
    hex += hexTable[byte >> 4]
    hex += hexTable[byte & 0x0f]
  }
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
    let shex = hex.substr(hex.length - 2, hex.length);
    bytes[i++] = parseInt(shex, 16);
    hex = hex.substr(0, hex.length - 2);
  }

  return bytes
}

export function SwapEndian(bytes: Bytes): Bytes {
  let clone = CloneBytes(bytes);
  return clone.reverse()
}

export function U8ArrayToBytes(arr: Array<u8>): Bytes {
  let bytes = new Bytes(arr.length);
  for (let i = 0; i < arr.length; i++) {
    bytes[i] = arr[i]
  }
  return bytes;
}

export function CloneBytes(bytes: Bytes): Bytes {
  let clone = new Bytes(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    clone[i] = bytes[i]
  }
  return clone;
}

export function BytesToU8Array(bytes: Bytes): Array<u8> {
  const arr = new Array<u8>(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes[i];
  }
  return arr;
}

// Concat two different bytes and returns a new bytes.
export function ConcatBytes(b1: Bytes, b2: Bytes): Bytes {
  const newBytes = new Array<u8>();
  for (let i = 0; i < b1.length; i++) {
    newBytes.push(b1[i])
  }
  for (let i = 0; i < b2.length; i++) {
    newBytes.push(b2[i])
  }
  return U8ArrayToBytes(newBytes);
}

export function CreateDataStream(size: u32): DataStream {
  const bytes = new Bytes(size);
  return new DataStream(changetype<usize>(bytes.buffer), size);
}

/**
 * Wrap a bytes into a datastream.
 * 
 * @param bytes 
 */
export function WrapDataStream(bytes: Bytes): DataStream {
  const ds = CreateDataStream(bytes.length);
  ds.writeVector<u8>(BytesToU8Array(bytes));
  return ds;
}