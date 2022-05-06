import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { Codec } from "/effect/core/Codec.ts";
import { Then, then } from "/effect/std/Then.ts";
import * as m from "/frame_metadata/mod.ts";
import * as s from "x/scale/mod.ts";

export class StorageEntryValueCodec<
  Beacon extends AnyResolvable,
  StorageEntry extends AnyResolvableA<m.StorageEntry>,
> extends Effect<{}, never, s.Codec<unknown>, [Codec<Beacon, Then<StorageEntry, number>>, StorageEntry]> {
  constructor(
    readonly beacon: Beacon,
    readonly storageEntry: StorageEntry,
  ) {
    const storageEntryTypeI = then(storageEntry)((resolved) => {
      return resolved.value;
    });
    super([new Codec(beacon, storageEntryTypeI), storageEntry], async (_, codec) => {
      return codec;
    });
  }
}
