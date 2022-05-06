import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { MetadataLookup, metadataLookup } from "/effect/frame/MetadataLookup.ts";
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
    super([metadataLookup(beacon), pallet, storageEntryName], async (_, metadataLookup, pallet, storageEntryName) => {
      return metadataLookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
    });
  }
}

export namespace StorageEntryMeta {
  export const fromPalletAndName = <
    Beacon extends AnyResolvable,
    Pallet extends AnyResolvableA<m.Pallet>,
    StorageEntryName extends AnyResolvableA<string>,
  >(
    beacon: Beacon,
    pallet: Pallet,
    storageEntryName: StorageEntryName,
  ): StorageEntryMeta<Beacon, Pallet, StorageEntryName> => {
    return new StorageEntryMeta(beacon, pallet, storageEntryName);
  };
}
