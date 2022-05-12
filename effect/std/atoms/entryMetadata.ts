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
  const args: [Lookup, PalletMetadata, EntryName] = [lookup, palletMetadata, entryName];
  return native(args, (lookup, palletMetadata, entryName) => {
    return async () => {
      return lookup.getStorageEntryByPalletAndName(palletMetadata, entryName);
    };
  });
};
