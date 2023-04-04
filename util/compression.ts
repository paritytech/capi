import { Buffer } from "../deps/std/streams.ts"

export async function compress(data: Uint8Array) {
  const compressed = new Buffer()
  await new Buffer(data).readable
    .pipeThrough(new CompressionStream("gzip"))
    .pipeTo(compressed.writable)
  return compressed.bytes()
}

export async function decompress(data: Uint8Array) {
  const decompressed = new Buffer()
  await new Buffer(data).readable
    .pipeThrough(new DecompressionStream("gzip"))
    .pipeTo(decompressed.writable)
  return decompressed.bytes()
}
