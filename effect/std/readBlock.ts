import { Codec } from "../../deps/scale.ts";
import { Extrinsic } from "../../frame_metadata/mod.ts";
import { rpc as knownRpc } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

type ConfigConstraint = knownRpc.Config<string, "state_getMetadata" | "chain_getBlock">;

export function readBlock<Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>]>(
  config: ConfigConstraint,
  ...[blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  const $extrinsic = a.$extrinsic(a.deriveCodec(metadata_), metadata_);
  const call = a.rpcCall(config, "chain_getBlock", [blockHash]);
  const decoded = sys.anon([$extrinsic, call], processChainGetBlock);
  return a.wrap(decoded, "block");
}

export function processChainGetBlock(
  $extrinsic: Codec<Extrinsic>,
  raw: rpc.OkMessage<ConfigConstraint, "chain_getBlock">,
) {
  const { block: { extrinsics, header }, justifications } = raw.result;
  return {
    justifications,
    block: {
      header,
      extrinsics: extrinsics.map((extrinsic) => {
        return $extrinsic.decode(U.hex.decode(extrinsic));
      }),
    },
  };
}
