import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { decoded } from "./core/decoded.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { hexDecode } from "./core/hex.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc/known.ts";

export function entryRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
    Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    keys: [...Keys],
    ...[blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const storageKey_ = storageKey($storageKey_, ...keys);
    const storageValueHex = state.getStorage(client)(storageKey_, blockHash);
    const entryValueTypeI = entryMetadata_.access("value");
    const $entry = codec(deriveCodec_, entryValueTypeI);
    return decoded($entry, hexDecode(storageValueHex), "value");
  };
}
