import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { MetadataLookup } from "/effect/core/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageEntryMeta<
  Beacon extends AnyResolvable,
  Pallet extends AnyResolvableA<m.Pallet>,
  StorageEntryName extends AnyResolvableA<string>,
> extends Effect<{}, never, m.StorageEntry, [MetadataLookup<Beacon>, Pallet, StorageEntryName]> {
  constructor(
    readonly beacon: Beacon,
    readonly pallet: Pallet,
    readonly storageEntryName: StorageEntryName,
  ) {
    super(
      [new MetadataLookup(beacon), pallet, storageEntryName],
      async (_, metadataLookup, pallet, storageEntryName) => {
        return metadataLookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
      },
    );
  }
}
