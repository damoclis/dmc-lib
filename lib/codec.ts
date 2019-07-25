export function StringToUsize(str: string): usize {
  return changetype<usize>(Bytes.fromString(str).buffer);
}

export function EncodeSLEB128(v: u32): Array<u8> {
  let arr = new Array<u8>();
  do {
    let b: u8 = <u8>v & <u8>0x7f;
    v >>= 7;
    b |= ((v > 0 ? 1 : 0) << 7);
    arr.push(b)
  } while (v);
  return arr;
}

// /**
//  * EncodeULEB128 appends v to b using unsigned LEB128 encoding.
//  */
// export function EncodeULEB128(v: u64): Bytes {
//   const bytes = new Array<u8>();
//   while (1) {
//     let c: u8 = <u8>(v & 0x7f);
//     v >>= 7;
//     if (v != 0) {
//       c |= 0x80;
//     }
//     bytes.push(c);
//     if ((c & 0x80) == 0) {
//       break;
//     }
//   }
//   return Bytes.fromU8Array(bytes);
// }

// /**
//  *  EncodeSLEB128 appends v to b using signed LEB128 encoding.
//  */
// export function EncodeSLEB128(v: i64): Bytes {
//   const bytes = new Array<u8>();
//   while (1) {
//     let c: u8 = <u8>(v & 0x7f);
//     let s: u8 = <u8>(v & 0x40);
//     v >>= 7;
//     if ((v != -1 || s == 0) && (v != 0 || s != 0)) {
//       c |= 0x80;
//     }
//     bytes.push(c);
//     if ((c & 0x80) == 0) {
//       break;
//     }
//   }
//   return Bytes.fromU8Array(bytes);
// }

// /** 
//  * DecodeULEB128 decodes bytes from stream with unsigned LEB128 encoding.
//  */
// export function DecodeULEB128(bytes: Bytes): u64 {
//   const ds = new DataStream(changetype<usize>(bytes.buffer), bytes.length);
//   let shift: u64 = 0;
//   let out: u64 = 0;
//   while (1) {
//     let b: u8 = ds.read<u8>();
//     out |= <u64>(b & 0x7f) << shift;
//     if ((b & 0x80) == 0) {
//       break;
//     }
//     shift += 7;
//   }

//   return out;
// }

// // DecodeSLEB128 decodes bytes from stream with signed LEB128 encoding.
// export function DecodeSLEB128(bytes: Bytes): u64 {
//   const ds = new DataStream(changetype<usize>(bytes.buffer), bytes.length);
//   let shift: u64 = 0;
//   let out: u64 = 0;
//   while (1) {
//     let b: u8 = ds.read<u8>();
//     out |= <u64>(b & 0x7f) << shift;
//     shift += 7;
//     if ((b & 0x80) == 0) {
//       if ((b & 0x40) != 0) {
//         out |= ~0 << shift;
//       }
//       break;
//     }
//   }

//   return out;
// }