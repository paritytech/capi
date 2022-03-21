import * as u from "/_/util/mod.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import { encodeStorageMapKey } from "/frame_metadata/StorageKeyEncoder.ts";
import * as s from "/system/mod.ts";

export const StorageKeyEncoded = <
  Metadata extends s.AnyEffectA<MetadataContainer>,
  PalletName extends s.AnyEffectA<string>,
  StorageEntryName extends s.AnyEffectA<string>,
  Keys extends [
    keyA?: s.AnyEffect,
    keyB?: s.AnyEffect,
  ],
>(
  metadata: Metadata,
  palletName: PalletName,
  storageEntryName: StorageEntryName,
  ...keys: Keys
) => {
  return s.effect<string>()(
    "FrameStorageKeyEncoded",
    {
      metadata,
      palletName,
      storageEntryName,
      keys: s.all(...keys),
    },
    async (_, resolved) => {
      return u.ok(
        encodeStorageMapKey(
          resolved.metadata,
          resolved.palletName,
          resolved.storageEntryName,
          resolved.keys[0],
          resolved.keys[1],
        ),
      );
    },
  );
};
