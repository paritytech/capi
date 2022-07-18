import { Config } from "../../Config.ts";
import { fromPrefixedHex } from "../../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";
import { rpcCall } from "./RpcCall.ts";

export type metadata = typeof metadata;
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
      return fromPrefixedHex(call.result);
    } catch (_e) {
      return new MetadataDecodeError();
    }
  });
}

export class MetadataRetrievalError extends U.ErrorCtor("MetadataRetrieval") {}
export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {}
