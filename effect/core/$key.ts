import * as Z from "../../deps/zones.ts";
import * as M from "../../frame_metadata/mod.ts";

export const $key = Z.atomf((
  deriveCodec: M.DeriveCodec,
  pallet: M.Pallet,
  storageEntry: M.StorageEntry,
) => {
  return M.$storageKey({
    deriveCodec,
    pallet,
    storageEntry,
  });
});
