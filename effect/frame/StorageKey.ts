import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { DeriveCodec, deriveCodec } from "./DeriveCodec.ts";

export class StorageKey<R, D extends AnyResolvable[]> extends Effect<R, never, string, D> {}

export namespace StorageKey {
  export const from = <
    Beacon extends AnyResolvableA<string>,
    Pallet extends AnyResolvableA<m.Pallet>,
    StorageEntry extends AnyResolvableA<m.StorageEntry>,
    Keys extends [
      a?: AnyResolvableA<unknown>,
      b?: AnyResolvableA<unknown>,
    ],
  >(
    beacon: Beacon,
    pallet: Pallet,
    storageEntry: StorageEntry,
    ...keys: Keys
  ): StorageKey<
    { hashers: m.HasherLookup },
    [
      DeriveCodec<Beacon>,
      Pallet,
      StorageEntry,
      ...Keys,
    ]
  > => {
    return new StorageKey(
      [
        deriveCodec(beacon),
        pallet,
        storageEntry,
        ...keys,
      ],
      async (runtime, deriveCodec, pallet, storageEntry, ...keys) => {
        // TODO: fix the typing
        return m.encodeKey(deriveCodec, runtime.hashers, pallet, storageEntry, ...keys as any);
      },
    );
  };
}
