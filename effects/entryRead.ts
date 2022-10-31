import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { decoded } from "./core/decoded.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";

export function entryRead<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
  Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
>(
  config: Config,
  palletName: PalletName,
  entryName: EntryName,
  keys: [...Keys],
  ...[blockHash]: [...Rest]
) {
  const metadata_ = metadata(config, blockHash);
  const deriveCodec_ = deriveCodec(metadata_);
  const palletMetadata_ = palletMetadata(metadata_, palletName);
  const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
  const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const storageKey_ = storageKey($storageKey_, ...keys);
  const storageCall = rpcCall(config, "state_getStorage", [storageKey_, blockHash]);
  const entryValueTypeI = entryMetadata_.access("value");
  const $entry = codec(deriveCodec_, entryValueTypeI);
  const resultHex = storageCall.access("result");
  return decoded($entry, resultHex, "value");
}
