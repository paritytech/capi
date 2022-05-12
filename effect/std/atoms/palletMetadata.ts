import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";

export const palletMetadata = <
  Lookup extends MaybeEffectLike<m.Lookup>,
  PalletName extends MaybeEffectLike<string>,
>(
  lookup: Lookup,
  palletName: PalletName,
) => {
  const args: [Lookup, PalletName] = [lookup, palletName];
  return native(args, (lookup, palletName) => {
    return async () => {
      return lookup.getPalletByName(palletName);
    };
  });
};
