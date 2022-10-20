import * as $ from "../deps/scale.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";

export class BlockRead<Rest extends [blockHash?: Z.$<U.HashHexString | undefined>]> extends Z.Name {
  root;

  constructor(
    config: known.rpc.Config<string, "state_getMetadata" | "chain_getBlock">,
    ...[blockHash]: [...Rest]
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    const $extrinsic_ = $extrinsic(deriveCodec(metadata_), metadata_, undefined!);
    const call = new RpcCall(config, "chain_getBlock", [blockHash]);
    const decoded = Z.call(Z.ls($extrinsic_, call), mapExtrinsicCall);
    this.root = Z.wrap(decoded, "block");
  }
}

function mapExtrinsicCall(
  [$extrinsic_, call]: [$.Codec<M.Extrinsic>, rpc.OkMessageBase<known.types.Block<U.HexString>>],
) {
  const { block: { extrinsics, header }, justifications } = call.result;
  return {
    justifications,
    block: {
      header,
      extrinsics: extrinsics.map((extrinsic) => {
        return $extrinsic_.decode(U.hex.decode(extrinsic));
      }),
    },
  };
}
