import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $requestStatus: $.Codec<t.types.pallet_preimage.RequestStatus> = _codec.$451

export type RequestStatus =
  | t.types.pallet_preimage.RequestStatus.Unrequested
  | t.types.pallet_preimage.RequestStatus.Requested
export namespace RequestStatus {
  export interface Unrequested {
    type: "Unrequested"
    deposit: [t.types.sp_core.crypto.AccountId32, t.types.u128]
    len: t.types.u32
  }
  export interface Requested {
    type: "Requested"
    deposit: [t.types.sp_core.crypto.AccountId32, t.types.u128] | undefined
    count: t.types.u32
    len: t.types.u32 | undefined
  }
  export function Unrequested(
    value: Omit<t.types.pallet_preimage.RequestStatus.Unrequested, "type">,
  ): t.types.pallet_preimage.RequestStatus.Unrequested {
    return { type: "Unrequested", ...value }
  }
  export function Requested(
    value: Omit<t.types.pallet_preimage.RequestStatus.Requested, "type">,
  ): t.types.pallet_preimage.RequestStatus.Requested {
    return { type: "Requested", ...value }
  }
}
