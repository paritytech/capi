import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { BlockRead } from "./BlockRead.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";
import { run } from "./run.ts";

export class BlockWatch extends Z.Name {
  root;

  constructor(
    config: Config,
    createWatchHandler: U.CreateListener<known.SignedBlock>,
  ) {
    super();
    this.root = new RpcSubscription(
      config,
      "chain_subscribeNewHeads",
      [],
      function subscribeNewHeadsHandler(stop) {
        const watchHandler = createWatchHandler(stop);
        return async (result) => {
          const blockNum: number = result.params.result.number;
          const blockHash = Z.sel(new RpcCall(config, "chain_getBlockHash", [blockNum]), "result");
          // TODO: use derived util from Zones
          const block = U.throwIfError(await run(new BlockRead(config, blockHash)));
          watchHandler(block.block);
        };
      },
      (ok) => new RpcCall(config, "chain_unsubscribeNewHead", [ok.result]),
    );
  }
}
