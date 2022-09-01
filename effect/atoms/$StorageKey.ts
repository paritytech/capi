import * as M from "../../frame_metadata/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const $storageKey = atomFactory(
  "$StorageKey",
  (
    deriveCodec: M.DeriveCodec,
    pallet: M.Pallet,
    storageEntry: M.StorageEntry,
  ) => {
    return M.$storageKey({
      deriveCodec,
      pallet,
      storageEntry,
    });
  },
);
