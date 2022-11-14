import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.pallet_authorship.pallet.Call.set_uncles
export namespace Call {
  /** Provide a set of uncles. */
  export interface set_uncles {
    type: "set_uncles"
    new_uncles: Array<types.sp_runtime.generic.header.Header>
  }
  /** Provide a set of uncles. */
  export function set_uncles(
    value: Omit<types.pallet_authorship.pallet.Call.set_uncles, "type">,
  ): types.pallet_authorship.pallet.Call.set_uncles {
    return { type: "set_uncles", ...value }
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
