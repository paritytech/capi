import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { codec } from "./core/codec.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import { storageKey } from "./core/storageKey.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc/known.ts";

export type WatchEntryEvent = [key?: U.Hex, value?: unknown];

export function entryWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
  >(
    palletName: PalletName,
    entryName: EntryName,
    keys: Keys,
    listener: U.Listener<WatchEntryEvent[], rpc.ClientSubscribeContext>,
  ) => {
    const metadata_ = metadata(client)();
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
    const listenerMapped = Z.call(Z.ls($entry, listener), ([$entry, listener]) => {
      return function listenerMapped(
        this: rpc.ClientSubscribeContext,
        changeset: known.StorageChangeSet,
      ) {
        const changes: WatchEntryEvent[] = changeset.changes.map(([key, val]) => {
          return [key, val ? $entry.decode(U.hex.decode(val)) : undefined];
        });
        listener.apply(this, [changes]);
      };
    });
    const subscriptionId = state.subscribeStorage(client)([storageKeys], listenerMapped);
    return state.unsubscribeStorage(client)(subscriptionId);
  };
}
