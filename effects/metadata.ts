import * as $ from "../deps/scale.ts"
import * as Z from "../deps/zones.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"
import { state } from "./rpc_known_methods.ts"

const k0_ = Symbol()
const k1_ = Symbol()
const k2_ = Symbol()
const k3_ = Symbol()
const k4_ = Symbol()

// TODO: callable object so that one doesn't need the extra parens when not specifying block hash?
export function metadata<Client extends Z.$<rpc.Client>>(client: Client) {
  return <Rest extends [blockHash?: Z.$<U.HexHash | undefined>]>(...[blockHash]: [...Rest]) => {
    return state
      .getMetadata(client)(blockHash)
      .next((encoded) => {
        try {
          return M.fromPrefixedHex(encoded)
        } catch (e) {
          return e as $.ScaleError
        }
      }, k0_)
  }
}

export function palletMetadata<Metadata extends Z.$<M.Metadata>, PalletName extends Z.$<string>>(
  metadata: Metadata,
  palletName: PalletName,
) {
  return Z
    .ls(metadata, palletName)
    .next(([metadata, palletName]) => {
      return M.getPallet(metadata, palletName)
    }, k1_)
}

export function entryMetadata<PalletMetadata extends Z.$<M.Pallet>, EntryName extends Z.$<string>>(
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) {
  return Z
    .ls(palletMetadata, entryName)
    .next(([palletMetadata, entryName]) => {
      return M.getEntry(palletMetadata, entryName)
    }, k2_)
}

export function constMetadata<
  PalletMetadata extends Z.$<M.Pallet>,
  ConstName extends Z.$<string>,
>(
  palletMetadata: PalletMetadata,
  constName: ConstName,
) {
  return Z
    .ls(palletMetadata, constName)
    .next(([palletMetadata, constName]) => {
      return M.getConst(palletMetadata, constName)
    }, k3_)
}

export function mapMetadata<PalletMetadata extends Z.$<M.Pallet>, EntryName extends Z.$<string>>(
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) {
  return Z
    .ls(palletMetadata, entryName)
    .next(([palletMetadata, entryName]) => {
      const entryMetadata = M.getEntry(palletMetadata, entryName)
      if (entryMetadata instanceof Error) return entryMetadata
      if (entryMetadata.type !== "Map") {
        return new ExpectedMapError()
      }
      return entryMetadata
    }, k4_)
}

export class ExpectedMapError extends Error {
  override readonly name = "ExpectedMapError"
}
