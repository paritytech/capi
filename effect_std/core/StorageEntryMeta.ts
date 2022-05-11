import { Effect, MaybeEffect } from "/effect/Base.ts";
import { MetadataLookup } from "/effect/core/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageEntryMeta<
  Beacon,
  Pallet extends MaybeEffect<m.Pallet>,
  StorageEntryName extends MaybeEffect<string>,
> extends Effect<[MetadataLookup<Beacon>, Pallet, StorageEntryName], m.StorageEntry, never, {}> {
  constructor(
    readonly beacon: Beacon,
    readonly pallet: Pallet,
    readonly storageEntryName: StorageEntryName,
  ) {
    super([new MetadataLookup(beacon), pallet, storageEntryName], (metadataLookup, pallet, storageEntryName) => {
      return async () => {
        return metadataLookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
      };
    });
  }
}
