import * as Z from "../deps/zones.ts";
import { Extrinsic } from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { BlockRead } from "./BlockRead.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";
import { run } from "./run.ts";

export class BlockWatch extends Z.Name {
  root;

  constructor(
    config: known.rpc.Config<
      string,
      "state_getMetadata" | "chain_getBlockHash" | "chain_getBlock" | "chain_unsubscribeNewHead",
      "chain_subscribeNewHeads"
    >,
    createWatchHandler: U.CreateWatchHandler<known.types.Block<Extrinsic>>,
  ) {
    super();
    this.root = new RpcSubscription(config, "chain_subscribeNewHeads", [], (stop) => {
      const watchHandler = createWatchHandler(stop);
      return async (result) => {
        const blockNum = result.params.result.number;
        const blockHash = Z.sel(new RpcCall(config, "chain_getBlockHash", [blockNum]), "result");
        const block = U.throwIfError(
          // STOP THIS MADNESS
          await run(new BlockRead(config, blockHash as unknown as U.HashHexString)),
        );
        watchHandler(block.block);
      };
    }, (ok) => {
      return new RpcCall(config, "chain_unsubscribeNewHead", [ok.result]);
    });
  }
}
