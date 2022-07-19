import { Config } from "../../Config.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { codec } from "../atoms/Codec.ts";
import { decoded } from "../atoms/Decoded.ts";
import { deriveCodec } from "../atoms/DeriveCodec.ts";
import { entryMetadata, metadata, palletMetadata } from "../atoms/Metadata.ts";
import * as a from "../atoms/mod.ts";
import { rpcCall } from "../atoms/RpcCall.ts";
import { select } from "../atoms/Select.ts";
import { storageKey } from "../atoms/StorageKey.ts";
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
  const metadata_ = metadata(config, blockHash);
  const deriveCodec_ = deriveCodec(metadata_);
  const palletMetadata_ = palletMetadata(metadata_, palletName);
  const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
  const storageKey_ = storageKey(deriveCodec_, palletMetadata_, entryMetadata_, keys);
  const storageCall = rpcCall(config, "state_getStorage", storageKey_, blockHash);
  const entryValueTypeI = select(entryMetadata_, "value");
  const entryCodec = codec(deriveCodec_, entryValueTypeI);
  const resultHex = select(storageCall, "result");
  return decoded(entryCodec, resultHex, "value");
}
