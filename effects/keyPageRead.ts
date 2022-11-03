import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $key } from "./core/$key.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { mapMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc/known.ts";

export function keyPageRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Count extends Z.$<number>,
    Rest extends [start?: unknown[] | undefined, blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    count: Count,
    ...[start, blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash as Rest[1]);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = mapMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const startKey = start ? storageKey($storageKey_, start) : undefined;
    const storageKey_ = storageKey($storageKey_);
    const keysEncoded = state.getKeysPaged(client)(
      storageKey_,
      count,
      startKey,
      blockHash as Rest[1],
    );
    const $key_ = $key(deriveCodec_, palletMetadata_, entryMetadata_);
    return Z.call(
      Z.ls($key_, keysEncoded),
      function keysDecodedImpl([$key, keysEncoded]) {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded));
        });
      },
    );
  };
}
