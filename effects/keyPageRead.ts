import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"
import { mapMetadata, metadata, palletMetadata } from "./metadata.ts"
import { state } from "./rpc_known_methods.ts"
import * as scale from "./scale.ts"

const k0_ = Symbol()

export function keyPageRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Count extends Z.$<number>,
    PartialKey extends unknown[],
    Rest extends [start?: unknown[] | undefined, blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    count: Count,
    partialKey: [...PartialKey],
    ...[start, blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash as Rest[1])
    const deriveCodec_ = scale.deriveCodec(metadata_)
    const palletMetadata_ = palletMetadata(metadata_, palletName)
    const entryMetadata_ = mapMetadata(palletMetadata_, entryName)
    const $storageKey_ = scale.$storageKey(deriveCodec_, palletMetadata_, entryMetadata_)
    const storageKey = scale.scaleEncoded($storageKey_, Z.ls(...partialKey)).next(U.hex.encode)
    const startKey = start ? scale.scaleEncoded($storageKey_, []).next(U.hex.encode) : undefined
    const keysEncoded = state.getKeysPaged(client)(
      storageKey,
      count,
      startKey,
      blockHash as Rest[1],
    )
    return Z
      .ls($storageKey_, keysEncoded)
      .next(([$key, keysEncoded]) => {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decoded(U.hex.decode(keyEncoded))
        })
      }, k0_)
  }
}
