import { getHashers } from "../../../bindings/mod.ts";
import { effector } from "../../../effect/impl/mod.ts";
import * as M from "../../../frame_metadata/mod.ts";

export const entryKey = effector.async(
  "entryKey",
  () =>
    async (
      deriveCodec: M.DeriveCodec,
      palletMetadata: M.Pallet,
      entryMetadata: M.StorageEntry,
      a?: unknown,
      b?: unknown,
    ) => {
      return M.encodeKey(deriveCodec, await getHashers(), palletMetadata, entryMetadata, a, b);
    },
);
