import * as M from "../../frame_metadata/mod.ts";
import { rpc as knownRpc } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atomFactory } from "../sys/Atom.ts";
import { Val } from "../sys/mod.ts";
import { rpcCall } from "./RpcCall.ts";

type ConfigConstraint = knownRpc.Config<string, "state_getMetadata">;

export function metadata<Rest extends [blockHash?: Val<U.HashHexString | undefined>]>(
  config: ConfigConstraint,
  ...[blockHash]: Rest
) {
  const call = rpcCall(config, "state_getMetadata", [blockHash]);
  return parseMetadata(call);
}

export const parseMetadata = atomFactory("Metadata", (
  call: rpc.OkMessage<ConfigConstraint, "state_getMetadata">,
) => {
  try {
    return M.fromPrefixedHex(call.result);
  } catch (e) {
    return new MetadataDecodeError(e);
  }
});

export const palletMetadata = atomFactory("PalletMetadata", (
  metadata: M.Metadata,
  palletName: string,
) => {
  return M.getPallet(metadata, palletName);
});

export const entryMetadata = atomFactory("EntryMetadata", (
  palletMetadata: M.Pallet,
  entryName: string,
) => {
  return M.getEntry(palletMetadata, entryName);
});

export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {
  // TODO: replace with internal scale error & ensure appropriate trace info
  constructor(readonly scaleError: unknown) {
    super();
  }
}
