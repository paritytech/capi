import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export function keyCodec<
  DeriveCodec extends Val<M.DeriveCodec>,
  PalletMetadata extends Val<M.Pallet>,
  StorageEntryMetadata extends Val<M.StorageEntry>,
>(
  deriveCodec: DeriveCodec,
  palletMetadata: PalletMetadata,
  storageEntryMetadata: StorageEntryMetadata,
) {
  return atom(
    "KeyCodec",
    [deriveCodec, palletMetadata, storageEntryMetadata],
    async (deriveCodec, pallet, storageEntry) => {
      return M.$storageKey({
        deriveCodec,
        hashers: await Hashers(),
        pallet,
        storageEntry,
      });
    },
  );
}
