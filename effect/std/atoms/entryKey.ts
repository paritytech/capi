import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";
import { entryMetadata } from "/effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "/effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "/effect/std/atoms/palletMetadata.ts";
import * as m from "/frame_metadata/mod.ts";
import { HasherRuntime } from "/runtime/Hashers.ts";

export const entryKey = <
  Beacon,
  PalletName extends MaybeEffectLike<string>,
  EntryName extends MaybeEffectLike<string>,
  Keys extends [
    a?: MaybeEffectLike<string>,
    b?: MaybeEffectLike<string>,
  ],
>(
  beacon: Beacon,
  palletName: PalletName,
  entryName: EntryName,
  ...keys: Keys
) => {
  const deriveCodec_ = deriveCodec(beacon);
  const lookup = metadataLookup(beacon);
  const palletMetadata_ = palletMetadata(lookup, palletName);
  // @ts-ignore
  const entryMetadata_ = entryMetadata(lookup, palletMetadata_, entryName);
  return native(
    [deriveCodec_, palletMetadata, entryMetadata_, ...keys],
    (deriveCodec, palletMetadata, entryMetadata, ...keys) => {
      return async (env: HasherRuntime) => {
        // @ts-ignore
        return m.encodeKey(deriveCodec, env.hashers, palletMetadata, entryMetadata, ...keys);
      };
    },
  );
};
