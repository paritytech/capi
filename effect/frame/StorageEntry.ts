import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { MetadataLookup, metadataLookup } from "/effect/frame/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageEntry<
  Beacon extends AnyEffect,
  Pallet extends AnyEffectA<m.Pallet>,
  StorageEntryName extends AnyEffectA<string>,
> extends Effect<{}, never, m.StorageEntry, [MetadataLookup<Beacon>, Pallet, StorageEntryName]> {
  constructor(
    beacon: Beacon,
    pallet: Pallet,
    storageEntryName: StorageEntryName,
  ) {
    super([metadataLookup(beacon), pallet, storageEntryName], async (_, metadataLookup, pallet, storageEntryName) => {
      return metadataLookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
    });
  }
}

export const storageEntry = <
  Beacon extends AnyEffect,
  Pallet extends AnyEffectA<m.Pallet>,
  StorageEntryName extends AnyEffectA<string>,
>(
  beacon: Beacon,
  pallet: Pallet,
  storageEntryName: StorageEntryName,
): StorageEntry<Beacon, Pallet, StorageEntryName> => {
  return new StorageEntry(beacon, pallet, storageEntryName);
};
