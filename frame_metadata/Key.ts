import * as hex from "https://deno.land/std@0.136.0/encoding/hex.ts";
import { DeriveCodec } from "./Codec.ts";
import * as m from "./Metadata.ts";

export type HasherLookup = {
  [_ in m.HasherKind]: (input: Uint8Array) => Uint8Array;
};

const finalize = (
  hashers: HasherLookup,
  palletName: string,
  storageEntryName: string,
  keys: Iterable<number> = [],
): string => {
  return new TextDecoder().decode(hex.encode(
    new Uint8Array([
      ...hashers[m.HasherKind.Twox128](new TextEncoder().encode(palletName)),
      ...hashers[m.HasherKind.Twox128](new TextEncoder().encode(storageEntryName)),
      ...keys,
    ]),
  ));
};

export const encodeKey = (
  deriveCodec: DeriveCodec,
  hashers: HasherLookup,
  pallet: m.Pallet,
  storageEntry: m.StorageEntry,
  ...keys: [a?: unknown, b?: unknown]
): string => {
  if (storageEntry._tag === m.StorageEntryTypeKind.Plain) {
    return finalize(hashers, pallet.name, storageEntry.name);
  }
  const keyTypeCodec = deriveCodec(storageEntry.key);
  const keyBytes = new Uint8Array((keys as unknown[]).reduce<number[]>((acc, key, i) => {
    if (key === undefined) {
      return acc;
    }
    const encoded = keyTypeCodec.encode(key);
    const hasherKind = storageEntry.hashers[i];
    if (!hasherKind) {
      throw new StorageEntryMissingHasher(i.toString());
    }
    const hasher = hashers[hasherKind];
    const hashed = hasher(encoded);
    return [...acc, ...hashed];
  }, []));
  return finalize(hashers, pallet.name, storageEntry.name, keyBytes);
};

export class StorageEntryMissingHasher extends Error {}
export class InvalidArgErr extends Error {}
