import * as hashers from "/target/wasm/crypto/mod.js";
import * as hex from "https://deno.land/std@0.136.0/encoding/hex.ts";
import { DeriveCodec } from "./Codec.ts";
import * as m from "./Metadata.ts";

export type HasherLookup = {
  [_ in m.HasherKind]: (input: Uint8Array) => Uint8Array;
};

export const defaultHashers: HasherLookup = {
  [m.HasherKind.Blake2_128]: hashers.blake2_128,
  [m.HasherKind.Blake2_128Concat]: hashers.blake2_128Concat,
  [m.HasherKind.Blake2_256]: hashers.blake2_256,
  [m.HasherKind.Identity]: hashers.identity,
  [m.HasherKind.Twox128]: hashers.twox128,
  [m.HasherKind.Twox256]: hashers.twox256,
  [m.HasherKind.Twox64Concat]: hashers.twox64Concat,
};

const finalize = (
  palletName: string,
  storageEntryName: string,
  keys: Iterable<number> = [],
): string => {
  return new TextDecoder().decode(hex.encode(
    new Uint8Array([
      ...hashers.twox128(new TextEncoder().encode(palletName)),
      ...hashers.twox128(new TextEncoder().encode(storageEntryName)),
      ...keys,
    ]),
  ));
};

export const encodeKey = (
  deriveCodec: DeriveCodec,
  hashers: HasherLookup,
  pallet: m.Pallet,
  storageEntry: m.StorageEntry,
  ...keys: [] | [unknown] | [unknown, unknown]
): string => {
  if (storageEntry._tag === m.StorageEntryTypeKind.Plain) {
    return finalize(pallet.name, storageEntry.name);
  }
  const keyTypeCodec = deriveCodec(0);
  const keyBytes = new Uint8Array((keys as unknown[]).reduce<number[]>((acc, key, i) => {
    const encoded = keyTypeCodec.encode(key);
    const hasherKind = storageEntry.hashers[i];
    if (!hasherKind) {
      throw new StorageEntryMissingHasher(i.toString());
    }
    const hasher = hashers[hasherKind];
    const hashed = hasher(encoded);
    return [...acc, ...hashed];
  }, []));
  return finalize(pallet.name, storageEntry.name, keyBytes);
};

export class StorageEntryMissingHasher extends Error {}
export class InvalidArgErr extends Error {}
