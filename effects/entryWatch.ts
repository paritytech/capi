import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./$storageKey.ts";
import { codec } from "./codec.ts";
import { deriveCodec } from "./deriveCodec.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc_known.ts";
import * as e$ from "./scale.ts";

export type WatchEntryEvent = [key?: unknown, value?: unknown];

const k0_ = Symbol();

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
    const storageKeys = e$
      .scaleEncoded($storageKey_, keys.length ? [keys] : [])
      .next(U.hex.encode)
      .next(U.tuple);
    const listenerMapped = Z.ls($entry, listener).next(([$entry, listener]) => {
      return function listenerMapped(
        this: rpc.ClientSubscribeContext,
        changeset: known.StorageChangeSet,
      ) {
        // TODO: in some cases there might be keys to decode
        // key ? $storageKey.decode(U.hex.decode(key)) : undefined
        const getKey = (key: known.Hex) => {
          return key;
        };
        const changes: WatchEntryEvent[] = changeset.changes.map(([key, val]) => {
          return [getKey(key), val ? $entry.decode(U.hex.decode(val)) : undefined];
        });
        listener.apply(this, [changes]);
      };
    }, k0_);
    const subscriptionId = state.subscribeStorage(client)([storageKeys], listenerMapped);
    return state
      .unsubscribeStorage(client)(subscriptionId)
      .zoned("EntryWatch");
  };
}
