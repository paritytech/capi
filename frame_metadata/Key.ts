import { HexString } from "/rpc/mod.ts";
import * as hex from "/util/hex.ts";
import { DeriveCodec } from "./Codec.ts";
import * as M from "./Metadata.ts";

export type HasherLookup = {
  [_ in M.HasherKind]: (input: Uint8Array) => Uint8Array;
};

const finalize = (
  hashers: HasherLookup,
  palletName: string,
  storageEntryName: string,
  keys: Iterable<number> = [],
): HexString => {
  return hex.encode(
    new Uint8Array([
      ...hashers[M.HasherKind.Twox128](new TextEncoder().encode(palletName)),
      ...hashers[M.HasherKind.Twox128](new TextEncoder().encode(storageEntryName)),
      ...keys,
    ]),
  ) as HexString;
};

export const encodeKey = (
  deriveCodec: DeriveCodec,
  hashers: HasherLookup,
  pallet: M.Pallet,
  storageEntry: M.StorageEntry,
  ...keys: [a?: unknown, b?: unknown]
): HexString => {
  if (storageEntry._tag === M.StorageEntryTypeKind.Plain) {
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
