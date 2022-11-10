import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $multisig: $.Codec<t.types.pallet_multisig.Multisig> = _codec.$589

export const $timepoint: $.Codec<t.types.pallet_multisig.Timepoint> = _codec.$82

export interface Multisig {
  when: t.types.pallet_multisig.Timepoint
  deposit: t.types.u128
  depositor: t.types.sp_core.crypto.AccountId32
  approvals: Array<t.types.sp_core.crypto.AccountId32>
}

export function Multisig(value: t.types.pallet_multisig.Multisig) {
  return value
}

export interface Timepoint {
  height: t.types.u32
  index: t.types.u32
}

export function Timepoint(value: t.types.pallet_multisig.Timepoint) {
  return value
}
