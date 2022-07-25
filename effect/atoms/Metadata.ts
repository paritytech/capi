import { Config } from "../../config/mod.ts";
import * as M from "../../frame_metadata/mod.ts";
import { rpc as knownRpc } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atomFactory } from "../sys/Atom.ts";
import { Val } from "../sys/mod.ts";
import { rpcCall } from "./RpcCall.ts";

export function metadata<Rest extends [blockHash?: Val<U.HashHexString | undefined>]>(
  config: Config<string, Pick<knownRpc.Methods, "state_getMetadata">>,
  ...[blockHash]: Rest
) {
  const call = rpcCall(config, "state_getMetadata", [blockHash]);
  return parseMetadata(call);
}

export const parseMetadata = atomFactory(
  "Metadata",
  (
    call: rpc.OkMessage<
      Config<string, Pick<knownRpc.Methods, "state_getMetadata">>,
      "state_getMetadata"
    >,
  ) => {
    try {
      return M.fromPrefixedHex(call.result);
    } catch (_e) {
      return new MetadataDecodeError();
    }
  },
);

// TODO: replace with general scale error & ensure appropriate trace info
export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {}

export const palletMetadata = atomFactory(
  "PalletMetadata",
  (metadata: M.Metadata, palletName: string) => {
    return M.getPallet(metadata, palletName);
  },
);

export const entryMetadata = atomFactory(
  "EntryMetadata",
  (palletMetadata: M.Pallet, entryName: string) => {
    return M.getEntry(palletMetadata, entryName);
  },
);
