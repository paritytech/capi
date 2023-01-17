import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import * as U from "../util/mod.ts"
import { state } from "./rpc_known_methods.ts"

// TODO: callable object so that one doesn't need the extra parens when not specifying block hash?
export function metadata<X>(...[client]: Args<X, [client: rpc.Client]>) {
  return <X>(...[blockHash]: Args<X, [blockHash?: U.HexHash | undefined]>) => {
    return state
      .getMetadata(client)(blockHash)
      .unwrapError()
      .pipe((encoded) => {
        try {
          return M.fromPrefixedHex(encoded)
        } catch (e) {
          return e as $.ScaleError
        }
      })
      .unwrapError()
  }
}

export function palletMetadata<X>(...args: Args<X, [metadata: M.Metadata, palletName: string]>) {
  return Rune.ls(args).pipe(([metadata, palletName]) => M.getPallet(metadata, palletName))
}

export function entryMetadata<X>(...args: Args<X, [palletMetadata: M.Pallet, entryName: string]>) {
  return Rune.ls(args).pipe(([palletMetadata, entryName]) => M.getEntry(palletMetadata, entryName))
}

export function constMetadata<X>(...args: Args<X, [palletMetadata: M.Pallet, constName: string]>) {
  return Rune.ls(args).pipe(([palletMetadata, constName]) => M.getConst(palletMetadata, constName))
}

export function mapMetadata<X>(...args: Args<X, [palletMetadata: M.Pallet, entryName: string]>) {
  return Rune.ls(args).pipe(([palletMetadata, entryName]) => {
    const entryMetadata = M.getEntry(palletMetadata, entryName)
    if (entryMetadata instanceof Error) return entryMetadata
    if (entryMetadata.type !== "Map") {
      return new ExpectedMapError()
    }
    return entryMetadata
  })
}

export class ExpectedMapError extends Error {
  override readonly name = "ExpectedMapError"
}
