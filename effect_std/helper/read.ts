// import { AnyResolvableA } from "/effect/Base.ts";
// import { PalletMeta } from "/effect/core/PalletMeta.ts";
// import { storageKeyFromBeaconAndPalletAndStorageEntry } from "/effect/core/StorageEntryKey.ts";
// import { StorageEntryMeta } from "/effect/core/StorageEntryMeta.ts";
// import { StorageEntryValueDecoded } from "/effect/core/StorageEntryValueDecoded.ts";
// import { RpcCall } from "/effect/rpc/Call.ts";
// import { Then } from "/effect/std/Then.ts";

// export const read = <
//   Beacon,
//   PalletName extends AnyResolvableA<string>,
//   StorageEntryName extends AnyResolvableA<string>,
//   StorageEntryKeys extends [
//     a?: AnyResolvableA<string>,
//     b?: AnyResolvableA<string>,
//   ],
// >(
//   beacon: Beacon,
//   palletName: PalletName,
//   storageEntryName: StorageEntryName,
//   ...storageEntryKeys: StorageEntryKeys
// ) => {
//   const pallet = new PalletMeta(beacon, palletName);
//   const storageEntryMeta = new StorageEntryMeta(beacon, pallet, storageEntryName);
//   const key = storageKeyFromBeaconAndPalletAndStorageEntry(beacon, pallet, storageEntryMeta, ...storageEntryKeys);
//   // @ts-ignore
//   const call = new RpcCall(beacon, "state_getStorage", [key]);
//   const result = new Then(call, (e) => {
//     return e.result;
//   });
//   return new StorageEntryValueDecoded(beacon, storageEntryMeta, result);
// };
