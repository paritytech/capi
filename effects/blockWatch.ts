import { Config } from "../config/mod.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { blockRead } from "./blockRead.ts";
import { rpcCall } from "./rpcCall.ts";
import { rpcSubscription } from "./rpcSubscription.ts";
import { run } from "./run.ts";

export function blockWatch(
  config: Config,
  createWatchHandler: U.CreateWatchHandler<known.SignedBlock>,
) {
  return rpcSubscription(
    config,
    "chain_subscribeNewHeads",
    [],
    function subscribeNewHeadsHandler(stop) {
      const watchHandler = createWatchHandler(stop);
      return async (result) => {
        const blockNum: number = result.params.result.number;
        const blockHash = rpcCall(config, "chain_getBlockHash", [blockNum]).access("result");
        // TODO: zones-level solution
        const block = U.throwIfError(await run(blockRead(config, blockHash)));
        watchHandler(block.block);
      };
    },
    (ok) => rpcCall(config, "chain_unsubscribeNewHead", [ok.result]),
  );
}
