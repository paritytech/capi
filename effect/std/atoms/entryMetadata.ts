import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import * as m from "/frame_metadata/mod.ts";

export const entryMetadata = <
  Lookup extends MaybeEffectLike<m.Lookup>,
  PalletMetadata extends MaybeEffectLike<m.Pallet>,
  EntryName extends MaybeEffectLike<string>,
>(
  lookup: Lookup,
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) => {
  return step(
    "EntryMetadata",
    [lookup, palletMetadata, entryName],
    (lookup, palletMetadata, entryName) => {
      return async () => {
        return lookup.getStorageEntryByPalletAndName(palletMetadata, entryName);
      };
    },
  );
};
