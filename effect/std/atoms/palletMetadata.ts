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
  return native([lookup, palletName], (lookup, palletName) => {
    return async () => {
      // TODO
      // @ts-ignore
      lookup.getPalletByName(palletName);
    };
  });
};
