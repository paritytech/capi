import { Config } from "../../config/mod.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function readBlock<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata" | "chain_getBlock">>,
  Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: C,
  ...[blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const rpcCall_ = a.rpcCall(config, "chain_getBlock", blockHash);
  const $extrinsic = a.$extrinsic(deriveCodec_, metadata_);
  const withDecodedExtrinsics = sys.atom(
    "WithDecodedExtrinsics",
    [rpcCall_, $extrinsic],
    (rpcCall_, $extrinsic) => {
      const { block: { extrinsics, header }, justifications } = rpcCall_.result;
      return {
        justifications,
        block: {
          header,
          extrinsics: extrinsics.map((extrinsic) => {
            return $extrinsic.decode(U.hex.decode(extrinsic));
          }),
        },
      };
    },
  );
  return a.wrap(withDecodedExtrinsics, "block");
}
