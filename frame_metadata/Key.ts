import * as $ from "../_deps/scale.ts";
import { DeriveCodec } from "./Codec.ts";
import * as M from "./Metadata.ts";

export type HasherLookup = { [_ in M.HasherKind]: (input: Uint8Array) => Uint8Array };

export interface StoragePathProps {
  hashers: HasherLookup;
  pallet: M.Pallet;
  storageEntry: M.StorageEntry;
}

export interface StoragePath {
  palletName: string;
  storageEntryName: string;
}
export function encodeStoragePath(props: StoragePathProps): Uint8Array {
  return new Uint8Array([
    ...props.hashers[M.HasherKind.Twox128](new TextEncoder().encode(props.pallet.name)),
    ...props.hashers[M.HasherKind.Twox128](new TextEncoder().encode(props.storageEntry.name)),
  ]);
}

export interface StorageMapKeyProps extends StoragePathProps {
  deriveCodec: DeriveCodec;
  storageEntry: M.StorageEntry & M.MapStorageEntryType;
}

export interface StorageMapKeys {
  keyA: unknown;
  keyB?: unknown;
}

export function $storageMapKeys(props: StorageMapKeyProps): $.Codec<StorageMapKeys> {
  const keyCodec = props.deriveCodec(props.storageEntry.key);
  return $.createCodec({
    _metadata: null,
    _staticSize: 0,
    _encode(buffer, storageMapKeys) {
      $.sizedUint8array(32)._encode(buffer, encodeStoragePath(props));
      buffer.insertArray(encodeKey(storageMapKeys.keyA));
      if (storageMapKeys.keyB !== undefined) {
        buffer.insertArray(encodeKey(storageMapKeys.keyB, true));
      }
    },
    _decode(buffer) {
      // Throw away
      $.sizedUint8array(32)._decode(buffer);
      const [keyAHasherKind, keyBHasherKind] = props.storageEntry.hashers;
      if (!keyAHasherKind) {
        throw new StorageEntryMissingHasher();
      }
      const keyA = decodeKey(keyAHasherKind);
      if (keyBHasherKind) {
        const keyB = decodeKey(keyBHasherKind);
        return { keyA, keyB };
      }
      return { keyA };

      function decodeKey(hasherKind: M.HasherKind): unknown {
        const leading = (<{ [K in M.HasherKind]?: $.Codec<any> }> {
          [M.HasherKind.Blake2_128Concat]: $.sizedUint8array(16),
          [M.HasherKind.Twox64Concat]: $.sizedUint8array(8),
        })[hasherKind];
        if (!leading) {
          throw new DecodeNonTransparentKeyError();
        }
        leading._decode(buffer);
        return keyCodec._decode(buffer);
      }
    },
  });

  function encodeKey(key: unknown, isSecond = false) {
    const encoded = keyCodec.encode(key);
    const hasherKind = props.storageEntry.hashers[isSecond ? 1 : 0];
    if (!hasherKind) {
      throw new StorageEntryMissingHasher();
    }
    const hasher = props.hashers[hasherKind];
    return hasher(encoded);
  }
}

export class StorageEntryMissingHasher extends Error {}
export class InvalidArgErr extends Error {}
export class DecodeNonTransparentKeyError extends Error {}
