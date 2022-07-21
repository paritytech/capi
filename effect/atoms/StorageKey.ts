import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export type StorageKey = ReturnType<typeof storageKey>;
export function storageKey<
  DeriveCodec extends Val<M.DeriveCodec>,
  PalletMetadata extends Val<M.Pallet>,
  EntryMetadata extends Val<M.StorageEntry>,
  KeysRest extends [keys?: Val<unknown>[] | undefined],
>(
  deriveCodec: DeriveCodec,
  palletMetadata: PalletMetadata,
  entryMetadata: EntryMetadata,
  ...[keys]: KeysRest
) {
  return atom(
    "StorageKey",
    [deriveCodec, palletMetadata, entryMetadata, ...keys ? keys : []],
    async (deriveCodec, pallet, storageEntry, ...keys) => {
      const keyCodec = M.$storageKey({
        deriveCodec,
        hashers: await Hashers(),
        pallet,
        storageEntry,
      });
      return U.hex.encode(keyCodec.encode(keys.length === 1 ? keys[0] : keys)) as U.HexString;
    },
  );
}
