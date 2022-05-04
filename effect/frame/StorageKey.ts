import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { Pallet, pallet } from "/effect/frame/Pallet.ts";
import { StorageEntry, storageEntry } from "/effect/frame/StorageEntry.ts";
import * as m from "/frame_metadata/mod.ts";
import { DeriveCodec, deriveCodec } from "./DeriveCodec.ts";

export class StorageKey<R, D extends AnyEffect[]> extends Effect<R, never, string, D> {}

export namespace StorageKey {
  export const from = <
    Beacon extends AnyEffectA<string>,
    PalletName extends AnyEffectA<string>,
    StorageEntryName extends AnyEffectA<string>,
    Keys extends [] | [AnyEffectA<unknown>] | [AnyEffectA<unknown>, AnyEffectA<unknown>],
  >(
    beacon: Beacon,
    palletName: PalletName,
    storageEntryName: StorageEntryName,
    ...keys: Keys
  ): StorageKey<
    { hashers: m.HasherLookup },
    [
      DeriveCodec<Beacon>,
      Pallet<Beacon, PalletName>,
      StorageEntry<Beacon, Pallet<Beacon, PalletName>, StorageEntryName>,
      ...Keys,
    ]
  > => {
    const pallet_ = pallet(beacon, palletName);
    // TODO: make resolved naming consistent
    return new StorageKey(
      [
        deriveCodec(beacon),
        pallet_,
        storageEntry(beacon, pallet_, storageEntryName),
        ...keys,
      ],
      async (runtime, deriveCodec, pallet, storageEntry, ...keys) => {
        // TODO: fix the typing
        return m.encodeKey(deriveCodec, runtime.hashers, pallet, storageEntry, ...(keys as any));
      },
    );
  };
}
