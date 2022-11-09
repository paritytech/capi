import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";

const k0_ = Symbol();

export const $storageKey = Z.call.fac((
  deriveCodec: M.DeriveCodec,
  pallet: M.Pallet,
  storageEntry: M.StorageEntry,
) => {
  return M.$storageKey({
    deriveCodec,
    pallet,
    storageEntry,
  });
}, k0_);
