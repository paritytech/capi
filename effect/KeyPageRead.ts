import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { $key } from "./core/$key.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, Metadata, palletMetadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { select } from "./util/select.ts";
import { wrap } from "./util/wrap.ts";

export class KeyPageRead<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Count extends Z.$<number>,
  Rest extends [start?: unknown[] | undefined, blockHash?: Z.$<U.HashHexString | undefined>],
> extends Z.Name {
  root;

  constructor(
    config: known.rpc.Config<string, "state_getMetadata" | "state_getKeysPaged">,
    palletName: PalletName,
    entryName: EntryName,
    count: Count,
    ...[start, blockHash]: Rest
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = Z.atom(
      [entryMetadata(palletMetadata_, entryName)],
      (entryMetadata) => {
        if (entryMetadata.type !== "Map") {
          return new ReadingKeysOfNonMapError();
        }
        return entryMetadata;
      },
    );
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const startKey = start ? storageKey($storageKey_, start) : undefined;
    const storageKey_ = storageKey($storageKey_, []);
    const call = new RpcCall(config, "state_getKeysPaged", [
      storageKey_,
      count,
      startKey,
      blockHash,
    ]);
    const $key_ = $key(deriveCodec_, palletMetadata_, entryMetadata_);
    const keysEncoded = select(call, "result");
    const keysDecoded = Z.atom([$key_, keysEncoded], ($key, keysEncoded) => {
      return keysEncoded.map((keyEncoded) => {
        return $key.decode(U.hex.decode(keyEncoded));
      });
    });
    this.root = wrap(keysDecoded, "keys");
  }
}

export class ReadingKeysOfNonMapError extends U.ErrorCtor("ReadingKeysOfNonMap") {}
