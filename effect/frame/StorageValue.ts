import * as u from "/_/util/mod.ts";
import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { StorageValueCodec, storageValueCodec } from "/effect/frame/StorageValueCodec.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageValue<
  Beacon extends AnyEffect,
  StorageEntry extends AnyEffectA<m.StorageEntry>,
  EncodedStorageValue extends AnyEffectA<string>,
> extends Effect<{}, never, unknown, [StorageValueCodec<Beacon, StorageEntry>, EncodedStorageValue]> {
  constructor(
    beacon: Beacon,
    storageEntry: StorageEntry,
    encodedStorageValue: EncodedStorageValue,
  ) {
    super([storageValueCodec(beacon, storageEntry), encodedStorageValue], async (_, codec, encoded) => {
      return codec.decode(u.hexToU8a(encoded));
    });
  }
}

export const storageValue = <
  Beacon extends AnyEffect,
  StorageEntry extends AnyEffectA<m.StorageEntry>,
  EncodedStorageValue extends AnyEffectA<string>,
>(
  beacon: Beacon,
  storageEntry: StorageEntry,
  encodedStorageValue: EncodedStorageValue,
): StorageValue<Beacon, StorageEntry, EncodedStorageValue> => {
  return new StorageValue(beacon, storageEntry, encodedStorageValue);
};
