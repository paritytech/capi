import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, Metadata, palletMetadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";

export type WatchEntryEvent = [key?: U.HexString, value?: unknown];

type Config = known.rpc.Config<
  string,
  "state_getMetadata" | "state_unsubscribeStorage",
  "state_subscribeStorage"
>;

export class EntryWatch<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
> extends Z.Name {
  root;

  constructor(
    readonly config: Config,
    readonly palletName: PalletName,
    readonly entryName: EntryName,
    readonly keys: Keys,
    readonly createWatchHandler: U.CreateWatchHandler<WatchEntryEvent[]>,
  ) {
    super();
    const metadata_ = new Metadata(config);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const entryValueTypeI = Z.sel(entryMetadata_, "value");
    const $entry = codec(deriveCodec_, entryValueTypeI);
    const storageKey_ = Z.call(storageKey($storageKey_, ...keys), function wrapWithList(x) {
      return [x];
    });
    const watchInit = Z.call($entry, function entryWatchInit($entry) {
      return U.mapCreateWatchHandler(
        createWatchHandler,
        (message: rpc.NotifMessage<Config, "state_subscribeStorage">) => {
          return message.params.result.changes.map(([key, val]) => {
            return <WatchEntryEvent> [key, val ? $entry.decode(U.hex.decode(val)) : undefined];
          });
        },
      );
    });
    this.root = new RpcSubscription(
      config,
      "state_subscribeStorage",
      [storageKey_],
      watchInit,
      (ok) => {
        return new RpcCall(config, "state_unsubscribeStorage", [ok.result]);
      },
    );
  }
}
