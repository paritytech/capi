import { Hashers } from "../../../bindings/mod.ts";
import * as M from "../../../frame_metadata/mod.ts";
import * as U from "../../../util/mod.ts";
import { effector } from "../../impl/mod.ts";

export const entryKey = effector.async(
  "entryKey",
  () =>
    async (
      deriveCodec: M.DeriveCodec,
      palletMetadata: M.Pallet,
      entryMetadata: M.StorageEntry,
      key?: unknown,
    ) => {
      return U.hex.encode(
        M.$storageMapKey({
          hashers: await Hashers(),
          pallet: palletMetadata,
          deriveCodec,
          storageEntry: entryMetadata,
        }).encode(key),
      ) as U.Hex;
    },
);
