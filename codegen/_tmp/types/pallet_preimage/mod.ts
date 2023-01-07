import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $requestStatus: $.Codec<types.pallet_preimage.RequestStatus> = codecs.$448
export type RequestStatus =
  | types.pallet_preimage.RequestStatus.Unrequested
  | types.pallet_preimage.RequestStatus.Requested
export namespace RequestStatus {
  export interface Unrequested {
    type: "Unrequested"
    value: [types.sp_core.crypto.AccountId32, types.u128] | undefined
  }
  export interface Requested {
    type: "Requested"
    value: types.u32
  }
  export function Unrequested(
    value: types.pallet_preimage.RequestStatus.Unrequested["value"],
  ): types.pallet_preimage.RequestStatus.Unrequested {
    return { type: "Unrequested", value }
  }
  export function Requested(
    value: types.pallet_preimage.RequestStatus.Requested["value"],
  ): types.pallet_preimage.RequestStatus.Requested {
    return { type: "Requested", value }
  }
}
