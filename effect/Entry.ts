import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { decoded } from "./core/decoded.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { Metadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";

export type WatchEntryEvent = [key?: U.Hex, value?: unknown];

export namespace Entry {
  export function read<
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
  ): EntryRead<PalletName, EntryName, Keys, Rest> {
    return new EntryRead(config, palletName, entryName, keys, blockHash);
  }

  export function watch<
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
  >(
    config: Config,
    palletName: PalletName,
    entryName: EntryName,
    keys: [...Keys],
    createWatchHandler: U.CreateWatchHandler<WatchEntryEvent[]>,
  ): EntryWatch<PalletName, EntryName, Keys> {
    return new EntryWatch(config, palletName, entryName, keys, createWatchHandler);
  }
}

abstract class StorageActor<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
> extends Z.Name {
  entryMetadata;
  deriveCodec;
  $storageKey;

  constructor(
    config: Config,
    palletName: PalletName,
    entryName: EntryName,
    ...[blockHash]: Rest
  ) {
    super();
    const metadata_ = new Metadata(config, blockHash);
    this.deriveCodec = deriveCodec(metadata_);
    const palletMetadata_ = metadata_.pallet(palletName);
    this.entryMetadata = palletMetadata_.entry(entryName);
    this.$storageKey = $storageKey(this.deriveCodec, palletMetadata_, this.entryMetadata);
  }
}

export class EntryRead<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
  Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
> extends StorageActor<PalletName, EntryName, Rest> {
  root;

  constructor(
    config: Config,
    palletName: PalletName,
    entryName: EntryName,
    keys: [...Keys],
    ...rest: [...Rest]
  ) {
    super(config, palletName, entryName, ...rest);
    const storageKey_ = storageKey(this.$storageKey, ...keys);
    const storageCall = new RpcCall(config, "state_getStorage", [storageKey_, rest[0]]);
    const entryValueTypeI = Z.sel(this.entryMetadata, "value");
    const $entry = codec(this.deriveCodec, entryValueTypeI);
    const resultHex = Z.sel(storageCall, "result");
    this.root = decoded($entry, resultHex, "value");
  }
}

export class EntryWatch<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
> extends StorageActor<PalletName, EntryName, [undefined]> {
  root;

  constructor(
    readonly config: Config,
    readonly palletName: PalletName,
    readonly entryName: EntryName,
    readonly keys: Keys,
    readonly createWatchHandler: U.CreateWatchHandler<WatchEntryEvent[]>,
  ) {
    super(config, palletName, entryName, undefined);
    const entryValueTypeI = Z.sel(this.entryMetadata, "value");
    const $entry = codec(this.deriveCodec, entryValueTypeI);
    const storageKeys = Z.call(
      storageKey(this.$storageKey, ...keys.length ? [keys] : []),
      function wrapWithList(v) {
        return [v];
      },
    );
    const watchInit = Z.call($entry, function entryWatchInit($entry) {
      return U.mapCreateWatchHandler(
        createWatchHandler,
        (message: rpc.NotifMessage) => {
          return message.params.result.changes.map(([key, val]: any) => {
            return <WatchEntryEvent> [key, val ? $entry.decode(U.hex.decode(val)) : undefined];
          });
        },
      );
    });
    this.root = new RpcSubscription(
      config,
      "state_subscribeStorage",
      [storageKeys],
      watchInit,
      (ok) => {
        return new RpcCall(config, "state_unsubscribeStorage", [ok.result]);
      },
    );
  }
}
