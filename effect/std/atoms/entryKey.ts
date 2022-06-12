import { getHashers } from "../../../bindings/mod.ts";
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
      keyA?: unknown,
      keyB?: unknown,
    ) => {
      const common = {
        hashers: await getHashers(),
        pallet: palletMetadata,
      };
      return U.hex.encode(
        keyA === undefined
          ? M.encodeStoragePath({
            ...common,
            storageEntry: entryMetadata as M.StorageEntry & M.PlainStorageEntryType,
          })
          : M.$storageMapKeys({
            ...common,
            deriveCodec,
            storageEntry: entryMetadata as M.StorageEntry & M.MapStorageEntryType,
          }).encode({ keyA, keyB }),
      ) as U.HexString;
    },
);
