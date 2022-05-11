import * as u from "/_/util/mod.ts";
import { Effect, MaybeEffect } from "/effect/Base.ts";
import { StorageEntryValueCodec } from "/effect/core/StorageEntryValueCodec.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageEntryValueDecoded<
  Beacon,
  StorageEntryMeta extends MaybeEffect<m.StorageEntry>,
  EncodedValue extends MaybeEffect<string>,
> extends Effect<[StorageEntryValueCodec<Beacon, StorageEntryMeta>, EncodedValue], { value: unknown }, never, {}> {
  constructor(
    readonly beacon: Beacon,
    readonly storageEntryMeta: StorageEntryMeta,
    readonly encodedStorageValue: EncodedValue,
  ) {
    super(
      [new StorageEntryValueCodec(beacon, storageEntryMeta), encodedStorageValue],
      (storageEntryValueCodec, encodedStorageValue) => {
        return async () => {
          const value = storageEntryValueCodec.decode(u.hexToU8a(encodedStorageValue));
          return { value };
        };
      },
    );
  }
}
