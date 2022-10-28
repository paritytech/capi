import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as U from "../util/mod.ts";
import { $key } from "./core/$key.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { mapMetadata, metadata, palletMetadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";

export function keyPageRead<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Count extends Z.$<number>,
  Rest extends [start?: unknown[] | undefined, blockHash?: Z.$<U.HexHash | undefined>],
>(
  config: Config,
  palletName: PalletName,
  entryName: EntryName,
  count: Count,
  ...[start, blockHash]: [...Rest]
) {
  const metadata_ = metadata(config, blockHash as Rest[1]);
  const deriveCodec_ = deriveCodec(metadata_);
  const palletMetadata_ = palletMetadata(metadata_, palletName);
  const entryMetadata_ = mapMetadata(palletMetadata_, entryName);
  const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const startKey = start ? storageKey($storageKey_, start) : undefined;
  const storageKey_ = storageKey($storageKey_);
  const call = rpcCall(config, "state_getKeysPaged", [
    storageKey_,
    count,
    startKey,
    blockHash as Rest[1],
  ]);
  const $key_ = $key(deriveCodec_, palletMetadata_, entryMetadata_);
  const keysEncoded = call.access("result");
  const keysDecoded = Z.call(
    Z.ls($key_, keysEncoded),
    function keysDecodedImpl([$key, keysEncoded]) {
      return keysEncoded.map((keyEncoded: U.Hex) => {
        return $key.decode(U.hex.decode(keyEncoded));
      });
    },
  );
  return Z.wrap(keysDecoded, "keys");
}
