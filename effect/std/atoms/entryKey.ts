import { getHashers } from "../../../bindings/mod.ts";
import * as B from "../../../branded.ts";
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
          hashers: await getHashers(),
          pallet: palletMetadata,
          deriveCodec,
          storageEntry: entryMetadata,
        }).encode(key),
      ) as B.HexString;
    },
);
