import { Config } from "../../config/mod.ts";
import * as M from "../../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";
import { rpcCall } from "./RpcCall.ts";

export type Metadata = ReturnType<typeof metadata>;
export function metadata<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata">>,
  BlockHashRest extends [blockHash?: Val<U.HashHexString | undefined>],
>(config: C, ...[blockHash]: BlockHashRest) {
  const call = rpcCall(config, "state_getMetadata", blockHash);
  return atom("Metadata", [call], async (call) => {
    if (call.error) {
      return new MetadataRetrievalError();
    }
    try {
      return M.fromPrefixedHex(call.result);
    } catch (_e) {
      return new MetadataDecodeError();
    }
  });
}

export class MetadataRetrievalError extends U.ErrorCtor("MetadataRetrieval") {}
export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {}

export type PalletMetadata = ReturnType<typeof palletMetadata>;
export function palletMetadata<
  Metadata extends Val<M.Metadata>,
  PalletName extends Val<string>,
>(
  metadata: Metadata,
  palletName: PalletName,
) {
  return atom("PalletMetadata", [metadata, palletName], M.getPallet);
}

export type EntryMetadata = ReturnType<typeof entryMetadata>;
export function entryMetadata<
  PalletMetadata extends Val<M.Pallet>,
  EntryName extends Val<string>,
>(
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) {
  return atom("EntryMetadata", [palletMetadata, entryName], M.getEntry);
}
