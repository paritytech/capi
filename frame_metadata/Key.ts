import * as $ from "../deps/scale.ts";
import { DeriveCodec } from "./Codec.ts";
import * as M from "./Metadata.ts";

export type HasherLookup = { [_ in M.HasherKind]: (input: Uint8Array) => Uint8Array };

export interface StorageKeyProps {
  deriveCodec: DeriveCodec;
  hashers: HasherLookup;
  pallet: M.Pallet;
  storageEntry: M.StorageEntry;
}

export function $storageKey(props: StorageKeyProps): $.Codec<unknown[]> {
  let keyCodecs: $.Codec<any>[];
  if (props.storageEntry.type === "Map") {
    const codec = props.deriveCodec(props.storageEntry.key);
    if (props.storageEntry.hashers.length === 1) {
      keyCodecs = [codec];
    } else {
      if (codec._metadata?.[0] !== $.tuple) {
        throw new Error("Expected key codec to be a tuple since there are multiple hashers");
      }
      keyCodecs = codec._metadata.slice(1) as any;
    }
  } else {
    keyCodecs = [];
  }
  const palletHash = props.hashers.Twox128(new TextEncoder().encode(props.pallet.name));
  const entryHash = props.hashers.Twox128(new TextEncoder().encode(props.storageEntry.name));
  const $keys = $.tuple(
    ...keyCodecs.map(($key, i) =>
      hashCodec((props.storageEntry as M.MapStorageEntryType).hashers[i]!, $key)
    ),
  );
  return $.createCodec({
    _metadata: [$storageKey, props],
    _staticSize: 0,
    _encode(buffer, key) {
      buffer.insertArray(palletHash);
      buffer.insertArray(entryHash);
      $keys._encode(buffer, key);
    },
    _decode(buffer) {
      // Ignore initial hashes
      buffer.index += 32;
      return $keys._decode(buffer);
    },
  });

  function hashCodec<T>(hasherKind: M.HasherKind, $value: $.Codec<T>): $.Codec<T> {
    const hasher = props.hashers[hasherKind];
    const leading = (<{ [K in M.HasherKind]?: number }> {
      Blake2_128Concat: 16,
      Twox64Concat: 8,
    })[hasherKind];
    if (hasherKind === "Identity") return $value;
    return $.createCodec({
      _metadata: null,
      _staticSize: 0,
      _encode(buffer, value) {
        buffer.insertArray(hasher($value.encode(value)));
      },
      _decode(buffer) {
        if (leading === undefined) {
          throw new DecodeNonTransparentKeyError();
        }
        buffer.index += leading;
        return $value._decode(buffer);
      },
    });
  }
}

export class StorageEntryMissingHasher extends Error {}
export class InvalidArgErr extends Error {}
export class DecodeNonTransparentKeyError extends Error {}
