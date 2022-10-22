import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import { NotifMessage } from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";
import { run } from "./run.ts";

export namespace Block {
  export function read<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]>(
    config: Config,
    ...rest: Rest
  ): BlockRead<Rest> {
    return new BlockRead(config, ...rest);
  }

  export function watch<CreateWatchHandler extends U.CreateWatchHandler<known.SignedBlock>>(
    config: Config,
    createWatchHandler: CreateWatchHandler,
  ): BlockWatch<CreateWatchHandler> {
    return new BlockWatch(config, createWatchHandler);
  }
}

export class BlockRead<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]> extends Z.Name {
  root;

  constructor(
    config: Config,
    ...[blockHash]: [...Rest]
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    const $extrinsic_ = $extrinsic(deriveCodec(metadata_), metadata_, undefined!);
    const call = new RpcCall(config, "chain_getBlock", [blockHash]);
    const decoded = Z.call(Z.ls($extrinsic_, call), function mapExtrinsicCall([$extrinsic_, call]) {
      const { block: { extrinsics, header }, justifications } = call.result;
      return {
        justifications,
        block: {
          header,
          extrinsics: extrinsics.map((extrinsic: U.Hex) => {
            return $extrinsic_.decode(U.hex.decode(extrinsic));
          }),
        },
      };
    });
    this.root = Z.wrap(decoded, "block");
  }
}

export class BlockWatch<CreateWatchHandler extends U.CreateWatchHandler<known.SignedBlock>>
  extends Z.Name
{
  root;

  constructor(
    config: Config,
    createWatchHandler: CreateWatchHandler,
  ) {
    super();
    const handler = Z.call(createWatchHandler, function subscribeNewHeadsHandler(cwh) {
      return (stop: () => void) => {
        const watchHandler = cwh(stop);
        return async (result: NotifMessage<{ number: number }>) => {
          const blockHash = Z.sel(
            new RpcCall(config, "chain_getBlockHash", [result.params.result.number]),
            "result",
          );
          // TODO: use derived util from Zones
          const block = U.throwIfError(await run(new BlockRead(config, blockHash)));
          watchHandler(block.block);
        };
      };
    });
    this.root = new RpcSubscription(
      config,
      "chain_subscribeNewHeads",
      [],
      handler,
      (ok) => new RpcCall(config, "chain_unsubscribeNewHead", [ok.result]),
    );
  }
}
