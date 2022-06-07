import { effector } from "/effect/mod.ts";
import * as M from "/frame_metadata/mod.ts";

export const entryMetadata = effector.sync(
  "entryMetadata",
  () =>
    (lookup: M.Lookup, palletMetadata: M.Pallet, entryName: string) => {
      return lookup.getStorageEntryByPalletAndName(palletMetadata, entryName);
    },
);
