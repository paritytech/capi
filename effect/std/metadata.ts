import * as B from "../../branded.ts";
import { RpcClient } from "../../rpc/Base.ts";
import { effector, EffectorItem } from "../impl/mod.ts";
import { metadataDecoded } from "./atoms/metadataDecoded.ts";
import { select } from "./atoms/select.ts";
import { rpcCall } from "./rpcCall.ts";

export const metadata = effector(
  "metadata",
  (rpc: EffectorItem<RpcClient>, blockHash?: EffectorItem<B.HashHexString>) => {
    const rpcCall_ = rpcCall(rpc, "state_getMetadata", blockHash);
    const result = select(rpcCall_, "result");
    return metadataDecoded(result);
  },
);
