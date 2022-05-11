import { Effect, MaybeEffect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import * as r from "/runtime/mod.ts";
import { DeriveCodec } from "./DeriveCodec.ts";

export class StorageEntryKey<
  Beacon,
  Pallet extends MaybeEffect<m.Pallet>,
  StorageEntry extends MaybeEffect<m.StorageEntry>,
  Keys extends [
    a?: MaybeEffect<unknown>,
    b?: MaybeEffect<unknown>,
  ],
> extends Effect<[Beacon, Pallet, StorageEntry, DeriveCodec<Beacon>, ...Keys], string, never, r.HasherRuntime> {
  keys;

  constructor(
    readonly beacon: Beacon,
    readonly pallet: Pallet,
    readonly storageEntry: StorageEntry,
    ...keys: Keys
  ) {
    super(
      [beacon, pallet, storageEntry, new DeriveCodec(beacon), ...keys],
      (_, pallet, storageEntry, deriveCodec, ...keys) => {
        return async (runtime) => {
          return m.encodeKey(deriveCodec, runtime.hashers, pallet, storageEntry, ...keys);
        };
      },
    );
    this.keys = keys;
  }
}
