import { spreadableOptional } from "/_/util/mod.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import { encodeStorageMapKey } from "/frame_metadata/StorageKeyEncoder.ts";
import * as sys from "/system/mod.ts";

export const StorageKeyEncoded = <
  Metadata extends sys.AnyEffectA<MetadataContainer>,
  PalletName extends sys.AnyEffectA<string>,
  StorageEntryName extends sys.AnyEffectA<string>,
  KeyA extends sys.AnyEffect,
  KeyB extends sys.AnyEffect,
>(
  metadata: Metadata,
  palletName: PalletName,
  storageEntryName: StorageEntryName,
  keyA?: KeyA,
  keyB?: KeyB,
) => {
  return sys.effect<string>()(
    "FrameStorageKeyEncoded",
    {
      metadata,
      palletName,
      storageEntryName,

      // TODO: do we truly want this...
      ...spreadableOptional("keyA", keyA),
      ...spreadableOptional("keyB", keyB),
    },
    async (_, resolved) => {
      return sys.ok(
        encodeStorageMapKey(
          resolved.metadata,
          resolved.palletName,
          resolved.storageEntryName,
          resolved.keyA,
          resolved.keyB,
        ),
      );
    },
  );
};
