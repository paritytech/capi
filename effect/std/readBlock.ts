import { Config } from "../../config/mod.ts";
import { rpc as knownRpc } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function readBlock<Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>]>(
  config: Config<string, Pick<knownRpc.Methods, "state_getMetadata" | "chain_getBlock">>,
  ...[blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  return a.wrap(
    sys.anon(
      [
        a.rpcCall(config, "chain_getBlock", [blockHash]),
        a.$extrinsic(a.deriveCodec(metadata_), metadata_),
      ],
      (rpcCall_, $extrinsic) => {
        const { block: { extrinsics, header }, justifications } = rpcCall_.result;
        return {
          justifications,
          block: {
            header,
            // @ts-ignore
            extrinsics: extrinsics.map((extrinsic) => {
              return $extrinsic.decode(U.hex.decode(extrinsic));
            }),
          },
        };
      },
    ),
    "block",
  );
}
