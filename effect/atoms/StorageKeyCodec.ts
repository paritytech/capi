import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export function storageKeyCodec<
  DeriveCodec extends Val<M.DeriveCodec>,
  PalletMetadata extends Val<M.Pallet>,
  EntryMetadata extends Val<M.StorageEntry>,
>(
  deriveCodec: DeriveCodec,
  palletMetadata: PalletMetadata,
  entryMetadata: EntryMetadata,
) {
  return atom(
    "StorageKeyCodec",
    [deriveCodec, palletMetadata, entryMetadata],
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
