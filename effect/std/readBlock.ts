import * as known from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

type Config = known.rpc.Config<string, "state_getMetadata" | "chain_getBlock">;

export function readBlock<Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>]>(
  config: Config,
  ...[blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  const $extrinsic = a.$extrinsic(a.deriveCodec(metadata_), metadata_);
  const call = a.rpcCall(config, "chain_getBlock", [blockHash]);
  const decoded = sys.anon([$extrinsic, call], ($extrinsic, call) => {
    const { block: { extrinsics, header }, justifications } = call.result;
    return {
      justifications,
      block: {
        header,
        extrinsics: extrinsics.map((extrinsic) => {
          return $extrinsic.decode(U.hex.decode(extrinsic));
        }),
      },
    };
  });
  return a.wrap(decoded, "block");
}
