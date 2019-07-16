export function CreateDataStream(size: u32): DataStream {
  const bytes = new Bytes(size);
  return new DataStream(changetype<usize>(bytes.buffer), size);
}