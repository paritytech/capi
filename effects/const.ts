import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { codec } from "./codec.ts";
import { deriveCodec } from "./deriveCodec.ts";
import { constMetadata, metadata, palletMetadata } from "./metadata.ts";
import * as e$ from "./scale.ts";

export function const_<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    ConstName extends Z.$<string>,
    Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    constName: ConstName,
    ...[blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const constMetadata_ = constMetadata(palletMetadata_, constName);
    const entryValueTypeI = constMetadata_.access("ty").access("id");
    const constValue = constMetadata_.access("value");
    const $const = codec(deriveCodec_, entryValueTypeI);
    return e$.scaleDecoded($const, constValue, "value").zoned("Const");
  };
}
Object.defineProperty(const_, "name", {
  value: "const",
  writable: false,
});
export { const_ as const };
