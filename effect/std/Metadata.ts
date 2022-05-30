import { effector, EffectorItem } from "/effect/Effect.ts";
import { metadataDecoded } from "/effect/std/atoms/metadataDecoded.ts";
import { rpcCall } from "/effect/std/atoms/rpcCall.ts";
import { select } from "/effect/std/atoms/select.ts";
import { RpcClient } from "/rpc/Base.ts";

export const metadata = effector("metadata", (rpc: EffectorItem<RpcClient>, blockHash?: EffectorItem<string>) => {
  const rpcCall_ = rpcCall(rpc, "state_getMetadata" as const, blockHash);
  const result = select(rpcCall_, "result");
  return metadataDecoded(result);
});
