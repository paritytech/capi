import { effector } from "/effect/Effect.ts";
import * as m from "/frame_metadata/mod.ts";

export const entryMetadata = effector.sync(
  "entryMetadata",
  () =>
    (lookup: m.Lookup, palletMetadata: m.Pallet, entryName: string) => {
      return lookup.getStorageEntryByPalletAndName(palletMetadata, entryName);
    },
);
