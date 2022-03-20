import { MetadataContainer } from "/frame_metadata/Container.ts";
import { encodeStorageMapKey } from "/frame_metadata/StorageKeyEncoder.ts";
import * as sys from "/system/mod.ts";

// TODO:

export const StorageKeyEncoded = <
  Metadata extends sys.AnyEffectA<MetadataContainer>,
  PalletName extends sys.AnyEffectA<string>,
  StorageEntryName extends sys.AnyEffectA<string>,
  Keys extends [keyA?: sys.AnyEffect, keyB?: sys.AnyEffect],
>(
  metadata: Metadata,
  palletName: PalletName,
  storageEntryName: StorageEntryName,
  ...keys: Keys
) => {
  return sys.effect<string>()(
    "FrameStorageKeyEncoded",
    {
      metadata,
      palletName,
      storageEntryName,
      keys: sys.all(...sys.depList(...keys)),
    },
    async (_, resolved) => {
      return sys.ok(
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
