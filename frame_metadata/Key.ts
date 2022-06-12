import * as $ from "../_deps/scale.ts";
import { DeriveCodec } from "./Codec.ts";
import * as M from "./Metadata.ts";

export type HasherLookup = { [_ in M.HasherKind]: (input: Uint8Array) => Uint8Array };

export interface StorageMapKeyProps {
  deriveCodec: DeriveCodec;
  hashers: HasherLookup;
  pallet: M.Pallet;
  storageEntry: M.StorageEntry;
}

const textEncoder = new TextEncoder();
export function $storageMapKey(props: StorageMapKeyProps): $.Codec<unknown> {
  const keyCodec = props.storageEntry.type === M.StorageEntryTypeKind.Map
    ? props.deriveCodec(props.storageEntry.key)
    : null;
  const hashTwox128 = props.hashers[M.HasherKind.Twox128];
  return $.createCodec({
    _metadata: [$storageMapKey, props],
    _staticSize: 0,
    _encode(buffer, key) {
      buffer.insertArray(hashTwox128(textEncoder.encode(props.pallet.name)));
      buffer.insertArray(hashTwox128(textEncoder.encode(props.storageEntry.name)));
      if (props.storageEntry.type === M.StorageEntryTypeKind.Map) {
        const { hashers } = props.storageEntry;
        if (hashers.length === 1) {
          buffer.insertArray(props.hashers[hashers[0]!](keyCodec!.encode(key)));
        } else {
          if (!(key instanceof Array) || key.length !== hashers.length) {
            throw new Error(`Expected key to be an array of length ${hashers.length}`);
          }
          for (let i = 0; i < hashers.length; i++) {
            buffer.insertArray(props.hashers[hashers[i]!](keyCodec!.encode(key[i])));
          }
        }
      } else {
        if (key != null) {
          throw new Error("Expected nullish key");
        }
      }
    },
    _decode(buffer) {
      // Ignore initial hashes
      buffer.index += 32;

      if (props.storageEntry.type === M.StorageEntryTypeKind.Plain) {
        return null;
      }

      const { hashers } = props.storageEntry;
      if (hashers.length === 1) {
        return decodeHasher(hashers[0]!);
      } else {
        return hashers.map(decodeHasher);
      }

      function decodeHasher(hasherKind: M.HasherKind): unknown {
        const leading = (<{ [K in M.HasherKind]?: number }> {
          [M.HasherKind.Identity]: 0,
          [M.HasherKind.Blake2_128Concat]: 16,
          [M.HasherKind.Twox64Concat]: 8,
        })[hasherKind];
        if (leading === undefined) {
          throw new DecodeNonTransparentKeyError();
        }
        buffer.index += leading;
        return keyCodec!._decode(buffer);
      }
    },
  });
}

export class StorageEntryMissingHasher extends Error {}
export class InvalidArgErr extends Error {}
export class DecodeNonTransparentKeyError extends Error {}
