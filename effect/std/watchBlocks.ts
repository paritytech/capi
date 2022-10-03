import { Extrinsic } from "../../frame_metadata/mod.ts";
import * as known from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import { readBlock } from "./readBlock.ts";

type Config = known.rpc.Config<
  string,
  "state_getMetadata" | "chain_getBlockHash" | "chain_getBlock" | "chain_unsubscribeNewHead",
  "chain_subscribeNewHeads"
>;

export function watchBlocks(
  config: Config,
  createWatchHandler: U.CreateWatchHandler<known.types.Block<Extrinsic>>,
) {
  return a.rpcSubscription(config, "chain_subscribeNewHeads", [], (stop) => {
    const watchHandler = createWatchHandler(stop);
    return async (result) => {
      const blockNum = result.params.result.number;
      const blockHash = a
        .rpcCall(config, "chain_getBlockHash", [blockNum])
        .select("result");
      const block = U.throwIfError(
        // STOP THIS MADNESS
        await readBlock(config, blockHash as unknown as U.HashHexString).run(),
      );
      watchHandler(block.block);
    };
  }, (ok) => {
    return a.rpcCall(config, "chain_unsubscribeNewHead", [ok.result]);
  });
}
