import { Config } from "../../config/mod.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function watchEntry<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata" | "state_subscribeStorage">>,
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Keys extends unknown[],
>(
  config: C,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  createListenerCb: rpc.CreateListenerCb<any /* TODO */>,
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
    return a.rpcSubscription(
      config,
      "state_subscribeStorage",
      [storageKeys],
      rpc.mapNotifications(createListenerCb, (notif) => {
        if (notif.params) {
          return notif.params.result.changes.map(([key, val]) => {
            return [key, val ? $entryCodec.decode(U.hex.decode(val)) : undefined];
          });
        }
        return;
      }),
    );
  });
}
