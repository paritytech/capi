import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $requestStatus: $.Codec<t.pallet_preimage.RequestStatus> = _codec.$451

export type RequestStatus =
  | t.pallet_preimage.RequestStatus.Unrequested
  | t.pallet_preimage.RequestStatus.Requested
export namespace RequestStatus {
  export interface Unrequested {
    type: "Unrequested"
    deposit: [t.sp_core.crypto.AccountId32, t.u128]
    len: t.u32
  }
  export interface Requested {
    type: "Requested"
    deposit: [t.sp_core.crypto.AccountId32, t.u128] | undefined
    count: t.u32
    len: t.u32 | undefined
  }
  export function Unrequested(
    value: Omit<t.pallet_preimage.RequestStatus.Unrequested, "type">,
  ): t.pallet_preimage.RequestStatus.Unrequested {
    return { type: "Unrequested", ...value }
  }
  export function Requested(
    value: Omit<t.pallet_preimage.RequestStatus.Requested, "type">,
  ): t.pallet_preimage.RequestStatus.Requested {
    return { type: "Requested", ...value }
  }
}

export * as pallet from "./pallet.ts"
