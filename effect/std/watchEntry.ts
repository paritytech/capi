import * as known from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export type WatchEntryEvent = [key?: U.HexString, value?: unknown];

type Config = known.rpc.Config<
  string,
  "state_getMetadata" | "state_unsubscribeStorage",
  "state_subscribeStorage"
>;

export function watchEntry<
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Keys extends unknown[],
>(
  config: Config,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  createWatchHandler: U.CreateWatchHandler<WatchEntryEvent[]>,
) {
  const metadata_ = a.metadata(config);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const palletMetadata_ = a.palletMetadata(metadata_, palletName);
  const entryMetadata_ = a.entryMetadata(palletMetadata_, entryName);
  const $storageKey = a.$storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const entryValueTypeI = a.select(entryMetadata_, "value");
  const $entry = a.codec(deriveCodec_, entryValueTypeI);
  const storageKeys = sys.anon([a.storageKey($storageKey, keys)], (v) => [v]);
  return sys.into([$entry], ($entryCodec) => {
    const watchInit = U.mapCreateWatchHandler(
      createWatchHandler,
      (message: rpc.NotifMessage<Config, "state_subscribeStorage">) => {
        return message.params.result.changes.map(([key, val]) => {
          return <WatchEntryEvent> [key, val ? $entryCodec.decode(U.hex.decode(val)) : undefined];
        });
      },
    );
    return a.rpcSubscription(
      config,
      "state_subscribeStorage",
      [storageKeys],
      watchInit,
      rpc.defaultCreateListenerCb,
      (ok) => {
        return a.rpcCall(config, "state_unsubscribeStorage", [ok.result]);
      },
    );
  });
}
