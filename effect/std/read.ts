import { Config } from "../../Config.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function read<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata" | "state_getStorage">>,
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Keys extends unknown[],
  BlockHashRest extends [blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: C,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  ...[blockHash]: BlockHashRest
) {
  const metadata_ = a.metadata(config, blockHash);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const palletMetadata_ = a.palletMetadata(metadata_, palletName);
  const entryMetadata_ = a.entryMetadata(palletMetadata_, entryName);
  const storageKey_ = a.storageKey(deriveCodec_, palletMetadata_, entryMetadata_, keys);
  const storageCall = a.rpcCall(config, "state_getStorage", storageKey_, blockHash);
  const entryValueTypeI = a.select(entryMetadata_, "value");
  const entryCodec = a.codec(deriveCodec_, entryValueTypeI);
  const resultHex = a.select(storageCall, "result");
  return a.decoded(entryCodec, resultHex, "value");
}
