import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"
import { entryReadRaw } from "./entryReadRaw.ts"
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts"
import * as scale from "./scale.ts"

export function entryRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
    Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    keys: [...Keys],
    ...[blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash)
    const deriveCodec_ = scale.deriveCodec(metadata_)
    const palletMetadata_ = palletMetadata(metadata_, palletName)
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName)
    const storageBytesHex = entryReadRaw(client)(palletName, entryName, keys, blockHash)
    const storageBytes = storageBytesHex.next(U.hex.decode)
    const entryValueTypeI = entryMetadata_.access("value")
    const $entry = scale.codec(deriveCodec_, entryValueTypeI)
    return scale.scaleDecoded($entry, storageBytes, "value")
  }
}
