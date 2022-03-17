import { Identity, identity } from "/_/util/mod.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as m from "/frame_metadata/V14.ts";
import * as e from "/scale/encode.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";
import * as asserts from "std/testing/asserts.ts";

export type HasherLookup = {
  [K in m.HasherKind]: Identity<Uint8Array>;
};
// TODO: inject this from elsewhere. Don't embed in `capi-frame-metadata`
const hasherLookup: HasherLookup = {
  [m.HasherKind.Blake2_128]: crypto.blake2_128,
  [m.HasherKind.Blake2_256]: crypto.blake2_256,
  [m.HasherKind.Blake2_128Concat]: crypto.blake2_128Concat,
  [m.HasherKind.Twox128]: crypto.twox128,
  [m.HasherKind.Twox256]: crypto.twox256,
  [m.HasherKind.Twox64Concat]: crypto.twox64Concat,
  [m.HasherKind.Identity]: identity,
};

export const encodeStorageValueKey = (
  palletName: string,
  entryName: string,
  keys: Iterable<number> = [],
): string => {
  return new TextDecoder().decode(hex.encode(
    new Uint8Array([
      ...crypto.twox128(new TextEncoder().encode(palletName)),
      ...crypto.twox128(new TextEncoder().encode(entryName)),
      ...keys,
    ]),
  ));
};

export const encodeStorageMapKey = (
  metadata: MetadataContainer,
  palletName: string,
  storageEntryName: string,
  ...keys: [unknown] | [unknown, unknown]
): string => {
  const storageEntry = metadata.lookup.getStorageEntry(palletName, storageEntryName);
  const { type } = storageEntry;
  asserts.assert(type._tag === m.StorageEntryTypeKind.Map);
  const keyBytes = new Uint8Array(keys.reduce<number[]>((acc, key, i) => {
    // // TODO: enable this
    // const encoderState = new e.EncoderState(128); // or less space?
    // FrameTypeEncoder(metadata, type.key)(key)(encoderState);
    if (!key) {
      return acc;
    }
    const hasherKind = type.hashers[i];
    asserts.assert(hasherKind);
    const hasher = hasherLookup[hasherKind];
    const hashed = hasher(key as Uint8Array /* TODO: encoderState.bytes */);
    return [...acc, ...hashed];
  }, []));
  return encodeStorageValueKey(palletName, storageEntryName, keyBytes);
};
