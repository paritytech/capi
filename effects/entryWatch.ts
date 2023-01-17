import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts"
import { state } from "./rpc_known_methods.ts"
import * as scale from "./scale.ts"

export type WatchEntryEvent = [key?: unknown, value?: unknown]

const k0_ = Symbol()

export function entryWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
  >(
    palletName: PalletName,
    entryName: EntryName,
    keys: Keys,
    createListener: U.CreateListener<rpc.ClientSubscriptionContext, WatchEntryEvent[]>,
  ) => {
    const metadata_ = metadata(client)()
    const deriveCodec_ = scale.deriveCodec(metadata_)
    const palletMetadata_ = palletMetadata(metadata_, palletName)
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName)
    const $storageKey_ = scale.$storageKey(deriveCodec_, palletMetadata_, entryMetadata_)
    const entryValueTypeI = entryMetadata_.access("value")
    const $entry = scale.codec(deriveCodec_, entryValueTypeI)
    const storageKeys = scale
      .scaleEncoded($storageKey_, keys.length ? [keys] : [])
      .next(U.hex.encode)
      .next((...x) => x)
    const createListenerMapped = Z
      .ls($entry, createListener)
      .next(([$entry, createListener]) => {
        return (ctx: rpc.ClientSubscriptionContext) => {
          const inner = createListener(ctx)
          return (changeset: rpc.known.StorageChangeSet) => {
            // TODO: in some cases there might be keys to decode
            // key ? $storageKey.decode(U.hex.decode(key)) : undefined
            const getKey = (key: rpc.known.Hex) => key
            const changes: WatchEntryEvent[] = changeset.changes.map(
              ([key, val]) => [getKey(key), val ? $entry.decoded(U.hex.decode(val)) : undefined],
            )
            return inner(changes)
          }
        }
      }, k0_)
    return state.subscribeStorage(client)([storageKeys], createListenerMapped)
  }
}
