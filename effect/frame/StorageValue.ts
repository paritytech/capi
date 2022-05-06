import * as u from "/_/util/mod.ts";
import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { StorageValueCodec, storageValueCodec } from "/effect/frame/StorageValueCodec.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageValue<
  Beacon extends AnyResolvable,
  StorageEntry extends AnyResolvableA<m.StorageEntry>,
  EncodedStorageValue extends AnyResolvableA<string>,
> extends Effect<{}, never, { value: unknown }, [StorageValueCodec<Beacon, StorageEntry>, EncodedStorageValue]> {
  constructor(
    readonly beacon: Beacon,
    readonly storageEntry: StorageEntry,
    readonly encodedStorageValue: EncodedStorageValue,
  ) {
    super([storageValueCodec(beacon, storageEntry), encodedStorageValue], async (_, codec, encoded) => {
      return { value: codec.decode(u.hexToU8a(encoded)) };
    });
  }
}

export const storageValue = <
  Beacon extends AnyResolvable,
  StorageEntry extends AnyResolvableA<m.StorageEntry>,
  EncodedStorageValue extends AnyResolvableA<string>,
>(
  beacon: Beacon,
  storageEntry: StorageEntry,
  encodedStorageValue: EncodedStorageValue,
): StorageValue<Beacon, StorageEntry, EncodedStorageValue> => {
  return new StorageValue(beacon, storageEntry, encodedStorageValue);
};
