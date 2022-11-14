import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export type RequestStatus =
  | types.pallet_preimage.RequestStatus.Unrequested
  | types.pallet_preimage.RequestStatus.Requested
export namespace RequestStatus {
  export interface Unrequested {
    type: "Unrequested"
    deposit: [types.sp_core.crypto.AccountId32, types.u128]
    len: types.u32
  }
  export interface Requested {
    type: "Requested"
    deposit: [types.sp_core.crypto.AccountId32, types.u128] | undefined
    count: types.u32
    len: types.u32 | undefined
  }
  export function Unrequested(
    value: Omit<types.pallet_preimage.RequestStatus.Unrequested, "type">,
  ): types.pallet_preimage.RequestStatus.Unrequested {
    return { type: "Unrequested", ...value }
  }
  export function Requested(
    value: Omit<types.pallet_preimage.RequestStatus.Requested, "type">,
  ): types.pallet_preimage.RequestStatus.Requested {
    return { type: "Requested", ...value }
  }
}
