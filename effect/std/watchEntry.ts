import { Config } from "../../config/mod.ts";
import { unreachable } from "../../deps/std/testing/asserts.ts";
import { type rpc as knownRpc } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function watchEntry<
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Keys extends unknown[],
>(
  config: Config<
    string,
    Pick<knownRpc.Methods, "state_getMetadata">,
    Pick<knownRpc.SubscriptionMethods, "state_subscribeStorage">
  >,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  createListenerCb: U.CreateListenerCb<{ TODO: true }[]>,
) {
  const metadata_ = a.metadata(config);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const palletMetadata_ = a.palletMetadata(metadata_, palletName);
  const entryMetadata_ = a.entryMetadata(palletMetadata_, entryName);
  const $storageKey = a.$storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const entryValueTypeI = a.select(entryMetadata_, "value");
  const $entry = a.codec(deriveCodec_, entryValueTypeI);
  const storageKeys = sys.anon([a.storageKey($storageKey, keys)], (v) => [v]);
  const createListenerCbMapped = U.mapListener(
    createListenerCb,
    (notif: rpc.NotifMessage<typeof config, "state_subscribeStorage">) => {
      if (notif.params) {
        return notif.params.result.changes.map(([key, val]) => {
          return { TODO: true } as const;
          // return [key, val ? $entryCodec.decode(U.hex.decode(val)) : undefined];
        });
      }
      unreachable();
    },
  );
  return sys.into([$entry], ($entryCodec) => {
    return a.rpcSubscription(
      config,
      "state_subscribeStorage",
      [storageKeys],
      createListenerCbMapped,
    );
  });
}
