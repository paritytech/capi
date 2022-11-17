import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.pallet_authorship.pallet.Call.setUncles
export namespace Call {
  /** Provide a set of uncles. */
  export interface setUncles {
    type: "setUncles"
    newUncles: Array<types.sp_runtime.generic.header.Header>
  }
  /** Provide a set of uncles. */
  export function setUncles(
    value: Omit<types.pallet_authorship.pallet.Call.setUncles, "type">,
  ): types.pallet_authorship.pallet.Call.setUncles {
    return { type: "setUncles", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "InvalidUncleParent"
  | "UnclesAlreadySet"
  | "TooManyUncles"
  | "GenesisUncle"
  | "TooHighUncle"
  | "UncleAlreadyIncluded"
  | "OldUncle"
