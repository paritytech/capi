import * as u from "/_/util/mod.ts";
import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { StorageEntryValueCodec } from "/effect/core/StorageEntryValueCodec.ts";
import * as m from "/frame_metadata/mod.ts";

export class StorageEntryValueDecoded<
  Beacon extends AnyResolvable,
  StorageEntryMeta extends AnyResolvableA<m.StorageEntry>,
  EncodedValue extends AnyResolvableA<string>,
  DecodedValue = unknown,
> extends Effect<{}, never, { value: DecodedValue }, [StorageEntryValueCodec<Beacon, StorageEntryMeta>, EncodedValue]> {
  constructor(
    readonly beacon: Beacon,
    readonly storageEntryMeta: StorageEntryMeta,
    readonly encodedStorageValue: EncodedValue,
  ) {
    super([new StorageEntryValueCodec(beacon, storageEntryMeta), encodedStorageValue], async (_, codec, encoded) => {
      return { value: codec.decode(u.hexToU8a(encoded)) as DecodedValue };
    });
  }
}
