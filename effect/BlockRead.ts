import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { Name } from "./core/runtime.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { wrap } from "./util/wrap.ts";

export class BlockRead<Rest extends [blockHash?: Z.$<U.HashHexString | undefined>]> extends Name {
  root;

  constructor(
    config: known.rpc.Config<string, "state_getMetadata" | "chain_getBlock">,
    ...[blockHash]: Rest
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    const $extrinsic_ = $extrinsic(deriveCodec(metadata_), metadata_);
    const call = new RpcCall(config, "chain_getBlock", [blockHash]);
    const decoded = Z.atom([$extrinsic_, call], ($extrinsic_, call) => {
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
    });
    this.root = wrap(decoded, "block");
  }
}
