import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";
import { rpcSubscription } from "./rpcSubscription.ts";

export type WatchEntryEvent = [key?: U.Hex, value?: unknown];

export function entryWatch<
  PalletName extends Z.$<string>,
  EntryName extends Z.$<string>,
  Keys extends unknown[],
>(
  config: Config,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  createWatchHandler: U.CreateWatchHandler<WatchEntryEvent[]>,
) {
  const metadata_ = metadata(config);
  const deriveCodec_ = deriveCodec(metadata_);
  const palletMetadata_ = palletMetadata(metadata_, palletName);
  const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
  const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const entryValueTypeI = entryMetadata_.access("value");
  const $entry = codec(deriveCodec_, entryValueTypeI);
  const storageKeys = Z.call(
    storageKey($storageKey_, ...keys.length ? [keys] : []),
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
  return rpcSubscription(
    config,
    "state_subscribeStorage",
    [storageKeys],
    watchInit,
    (ok) => {
      return rpcCall(config, "state_unsubscribeStorage", [ok.result]);
    },
  );
}
