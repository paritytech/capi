import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";
import { deriveCodec } from "./DeriveCodec.ts";
import { metadata } from "./Metadata.ts";

export type storageKey = typeof storageKey;
export function storageKey<
  // Unfortunately, we need to `any`-ify to prevent contravariant incompatibility
  C extends Val<rpc.StdClient<any>>,
  PalletName extends Val<string>,
  EntryName extends Val<string>,
  Keys extends Val<unknown>[],
  BlockHashRest extends [blockHash?: Val<U.HashHexString>],
>(
  client: C,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  ...[blockHash]: BlockHashRest
) {
  const metadata_ = metadata(client, blockHash);
  const deriveCodec_ = deriveCodec(metadata_);
  return atom(
    "StorageKey",
    [metadata_, deriveCodec_, palletName, entryName, ...keys],
    async (metadata, deriveCodec, palletName, entryName, ...keys) => {
      const pallet = M.getPallet(metadata, palletName);
      if (pallet instanceof Error) {
        return pallet;
      }
      const storageEntry = M.getEntry(pallet, entryName);
      if (storageEntry instanceof Error) {
        return storageEntry;
      }
      const keyCodec = M.$storageKey({
        deriveCodec,
        hashers: await Hashers(),
        pallet,
        storageEntry,
      });
      return keyCodec.encode(keys.length === 1 ? keys[0] : keys);
    },
  );
}
