import { $metadata, transformMetadata } from "./raw/v14.ts"

export function decodeMetadata(encoded: Uint8Array) {
  return transformMetadata($metadata.decode(encoded))
}
