import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";
import { metadata } from "./Metadata.ts";

export type storageKey = typeof storageKey;
export function storageKey<
  // Unfortunately, we need to `any`-ify to prevent contravariant incompatibility
  C extends Val<rpc.StdClient<any>>,
  PalletName extends Val<string>,
  EntryName extends Val<string>,
  Keys extends Val<string>[],
  BlockHashRest extends [blockHash?: Val<U.HashHexString>],
>(
  client: C,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  ...[blockHash]: BlockHashRest
) {
  return atom(
    "StorageKey",
    [metadata(client), palletName, entryName, blockHash, ...keys],
    async (metadata, palletName, entryName, blockHash, ...keys) => {
    },
  );
}

export class MetadataRetrievalError extends U.ErrorCtor("MetadataRetrieval") {}
export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {}
