import { Effect, MaybeEffect } from "/effect/Base.ts";
import { Codec } from "/effect/core/Codec.ts";
import { Then } from "/effect/std/Then.ts";
import * as m from "/frame_metadata/mod.ts";
import * as s from "x/scale/mod.ts";

export class StorageEntryValueCodec<
  Beacon,
  StorageEntry extends MaybeEffect<m.StorageEntry>,
> extends Effect<[Codec<Beacon, Then<StorageEntry, number>>], s.Codec<unknown>, never, {}> {
  constructor(
    readonly beacon: Beacon,
    readonly storageEntry: StorageEntry,
  ) {
    super([new Codec(beacon, new Then(storageEntry, (target) => target.value))], (codec) => {
      return async () => {
        return codec;
      };
    });
  }
}
