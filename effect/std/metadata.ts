import { RpcClient, RpcError } from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { effector, EffectorItem } from "../impl/mod.ts";
import { metadataDecoded } from "./atoms/metadataDecoded.ts";
import { select } from "./atoms/select.ts";
import { rpcCall } from "./rpcCall.ts";

export const metadata = effector(
  "metadata",
  (rpc: EffectorItem<RpcClient<RpcError>>, blockHash?: EffectorItem<U.HexHash>) => {
    const rpcCall_ = rpcCall(rpc, "state_getMetadata", blockHash);
    const result = select(rpcCall_, "result");
    return metadataDecoded(result);
  },
);
