import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
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
  return native([lookup, palletMetadata, entryName], (lookup, palletMetadata, entryName) => {
    return async () => {
      // TODO
      // @ts-ignore
      lookup.getStorageEntryByPalletAndName(palletMetadata, entryName);
    };
  });
};
