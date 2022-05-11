import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";
import { entryMetadata } from "/effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "/effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "/effect/std/atoms/palletMetadata.ts";
import * as m from "/frame_metadata/mod.ts";
import { HasherRuntime } from "/runtime/Hashers.ts";

// export const entryValueCodec = <
//   Beacon,
//   StorageEntry extends MaybeEffectLike<m.StorageEntry>,
//   BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
// >(
//   beacon: Beacon,
//   storageEntry: StorageEntry,
//   ...[blockHash]: BlockHashRest
// ) => {
//   const deriveCodec_ = deriveCodec(beacon);
//   const lookup = metadataLookup(beacon);
//   const palletMetadata_ = palletMetadata(lookup, palletName);
//   // @ts-ignore
//   const entryMetadata_ = entryMetadata(lookup, palletMetadata_, entryName);
//   return native(
//     [deriveCodec_, palletMetadata, entryMetadata_, ...keys],
//     (deriveCodec, palletMetadata, entryMetadata, ...keys) => {
//       return async (env: HasherRuntime) => {
//         // @ts-ignore
//         return m.encodeKey(deriveCodec, env.hashers, palletMetadata, entryMetadata, ...keys);
//       };
//     },
//   );
// };

// import { Effect, MaybeEffect } from "/effect/Base.ts";
// import { Codec } from "/effect/core/Codec.ts";
// import { Then } from "/effect/std/Then.ts";
// import * as m from "/frame_metadata/mod.ts";
// import * as s from "x/scale/mod.ts";

// export class StorageEntryValueCodec<
//   Beacon,
//   StorageEntry extends MaybeEffect<m.StorageEntry>,
// > extends Effect<[Codec<Beacon, Then<StorageEntry, number>>], s.Codec<unknown>, never, {}> {
//   constructor(
//     readonly beacon: Beacon,
//     readonly storageEntry: StorageEntry,
//   ) {
//     super([new Codec(beacon, new Then(storageEntry, (target) => target.value))], (codec) => {
//       return async () => {
//         return codec;
//       };
//     });
//   }
// }
