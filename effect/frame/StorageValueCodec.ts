import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { Codec, codec } from "/effect/frame/Codec.ts";
import { Then, then } from "/effect/std/Then.ts";
import * as m from "/frame_metadata/mod.ts";
import * as s from "x/scale/mod.ts";

export class StorageValueCodec<
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
    super([codec(beacon, storageEntryTypeI), storageEntry], async (_, codec) => {
      return codec;
    });
  }
}

export const storageValueCodec = <
  Beacon extends AnyResolvable,
  StorageEntry extends AnyResolvableA<m.StorageEntry>,
>(
  beacon: Beacon,
  storageEntry: StorageEntry,
): StorageValueCodec<Beacon, StorageEntry> => {
  return new StorageValueCodec(beacon, storageEntry);
};
