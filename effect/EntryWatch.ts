import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { Name } from "./core/runtime.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, Metadata, palletMetadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcSubscription } from "./RpcSubscription.ts";
import { select } from "./util/select.ts";

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
> extends Name {
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
    const entryValueTypeI = select(entryMetadata_, "value");
    const $entry = codec(deriveCodec_, entryValueTypeI);
    const storageKeys = Z.atom([storageKey($storageKey_, keys)], (v) => [v]);
    const watchInit = Z.atom([$entry], ($entry) => {
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
      [storageKeys],
      watchInit,
      (ok) => {
        return new RpcCall(config, "state_unsubscribeStorage", [ok.result]);
      },
    );
  }
}
