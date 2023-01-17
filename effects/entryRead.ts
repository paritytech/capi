import * as rpc from "../rpc/mod.ts"
import { Args, resolveArgs } from "../rune/mod.ts"
import * as U from "../util/mod.ts"
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts"
import { state } from "./rpc_known_methods.ts"
import * as scale from "./scale.ts"

export function entryRead<X>(...[client]: Args<X, [client: rpc.Client]>) {
  return <X>(
    ...args: Args<X, [
      palletName: string,
      entryName: string,
      keys: unknown[],
      blockHash?: U.HexHash,
    ]>
  ) => {
    const [palletName, entryName, keys, blockHash] = resolveArgs(args)
    const metadata_ = metadata(client)(blockHash)
    const deriveCodec_ = scale.deriveCodec(metadata_)
    const palletMetadata_ = palletMetadata(metadata_, palletName).unwrapError()
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName).unwrapError()
    const $storageKey_ = scale.$storageKey({
      deriveCodec: deriveCodec_,
      pallet: palletMetadata_,
      storageEntry: entryMetadata_,
    })
    const storageKey = $storageKey_.encoded(keys).unwrapError().pipe(U.hex.encode)
    const storageBytesHex = state.getStorage(client)(storageKey, blockHash).unwrapError()
    const storageBytes = storageBytesHex.pipe(U.hex.decode)
    const entryValueTypeI = entryMetadata_.pipe((x) => x.value)
    const $entry = scale.codec(deriveCodec_, entryValueTypeI)
    return $entry.decoded(storageBytes)
  }
}
