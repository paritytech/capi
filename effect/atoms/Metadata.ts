import { Config } from "../../Config.ts";
import { fromPrefixedHex } from "../../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export type metadata = typeof metadata;
export function metadata<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata">>,
  BlockHashRest extends [blockHash?: Val<U.HashHexString>],
>(config: C, ...[blockHash]: BlockHashRest) {
  return atom(
    "Metadata",
    [rpcClient(config), blockHash],
    async (client, blockHash) => {
      const result = await client.call("state_getMetadata", [blockHash]);
      if (result.error) {
        return new MetadataRetrievalError();
      }
      try {
        return fromPrefixedHex(result.result);
      } catch (_e) {
        return new MetadataDecodeError();
      }
    },
  );
}

export class MetadataRetrievalError extends U.ErrorCtor("MetadataRetrieval") {}
export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {}
