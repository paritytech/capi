import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { decoded } from "./core/decoded.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, Metadata, palletMetadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { select } from "./util/select.ts";

export class EntryRead<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
  Rest extends [blockHash?: Z.$<U.HashHexString | undefined>],
> extends Z.Name {
  root;

  constructor(
    config: known.rpc.Config<string, "state_getMetadata" | "state_getStorage">,
    palletName: PalletName,
    entryName: EntryName,
    keys: Keys,
    ...[blockHash]: Rest
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const storageKey_ = storageKey($storageKey_, ...keys);
    const storageCall = new RpcCall(config, "state_getStorage", [storageKey_, blockHash]);
    const entryValueTypeI = select(entryMetadata_, "value");
    const $entry = codec(deriveCodec_, entryValueTypeI);
    const resultHex = select(storageCall, "result");
    this.root = decoded($entry, resultHex, "value");
  }
}
