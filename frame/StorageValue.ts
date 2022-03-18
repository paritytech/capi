import { StorageEntryResolved } from "/frame/StorageEntry.ts";
import { StorageKeyEncoded } from "/frame/StorageKeyEncoded.ts";
import { TypeDecoded } from "/frame/TypeDecoded.ts";
import * as rpc from "/rpc/State/GetStorage.ts";
import * as sys from "/system/mod.ts";

// TODO: this be folded into `StorageMapValue`? Seems to be (aside from the two would-be optional params) the same.

export const StorageValue = <
  Beacon,
  StorageEntry extends sys.AnyEffectA<StorageEntryResolved<Beacon>>,
>(storageEntry: StorageEntry) => {
  const a = sys.accessor(storageEntry);

  const metadata = a((r) => r.chain.metadata);
  const palletName = a((r) => r.palletName);
  const name = a((r) => r.raw.name);
  const typeIndex = a((r) => r.raw.type.value);
  const resource = a((r) => r.chain.resource);

  const keyEncoded = StorageKeyEncoded(metadata, palletName, name);
  const getStorageResult = rpc.StateGetStorage(resource, keyEncoded);
  return TypeDecoded(metadata, typeIndex, getStorageResult);
};
