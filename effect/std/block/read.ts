import { Config } from "../../../config/mod.ts";
import { KnownRpcMethods } from "../../../known/mod.ts";
import * as U from "../../../util/mod.ts";
import * as a from "../../atoms/mod.ts";
import * as sys from "../../sys/mod.ts";

export function readBlock<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata" | "chain_getBlock">>,
  Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: C,
  ...[blockHash]: Rest
) {
  // const metadata_ = a.metadata(config, blockHash);
  // const deriveCodec_ = a.deriveCodec(metadata_);
  const rpcCall_ = a.rpcCall(config, "chain_getBlock", blockHash);
  const result = a.select(rpcCall_, "result");
  // TODO: flat map one effect into another
  return a.wrap(result, "block");
}
