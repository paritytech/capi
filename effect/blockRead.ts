import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as U from "../util/mod.ts";
import { $extrinsic } from "./core/$extrinsic.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { metadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";

export function blockRead<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]>(
  config: Config,
  ...[blockHash]: [...Rest]
) {
  const metadata_ = metadata(config, blockHash);
  const $extrinsic_ = $extrinsic(deriveCodec(metadata_), metadata_, undefined!);
  const call = rpcCall(config, "chain_getBlock", [blockHash]);
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
  return Z.wrap(decoded, "block");
}
