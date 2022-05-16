import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import * as m from "/frame_metadata/mod.ts";

export const palletMetadata = <
  Lookup extends MaybeEffectLike<m.Lookup>,
  PalletName extends MaybeEffectLike<string>,
>(
  lookup: Lookup,
  palletName: PalletName,
) => {
  const args: [Lookup, PalletName] = [lookup, palletName];
  return step(args, (lookup, palletName) => {
    return async () => {
      return lookup.getPalletByName(palletName);
    };
  });
};
