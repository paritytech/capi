import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const $key = atomFactory("KeyCodec", async (
  deriveCodec: M.DeriveCodec,
  pallet: M.Pallet,
  storageEntry: M.StorageEntry,
) => {
  return M.$storageKey({
    deriveCodec,
    hashers: await Hashers(),
    pallet,
    storageEntry,
  });
});
