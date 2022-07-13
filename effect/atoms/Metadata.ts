import { fromPrefixedHex } from "../../frame_metadata/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export function metadata<
  // Unfortunately, we need to `any`-ify to prevent contravariant incompatibility
  C extends Val<rpc.StdClient<any>>,
  BlockHashRest extends [blockHash?: Val<U.HashHexString>],
>(client: C, ...[blockHash]: BlockHashRest) {
  return atom(
    "Metadata",
    [client, blockHash],
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
