import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $multisig: $.Codec<types.pallet_multisig.Multisig> = _codec.$589

export const $timepoint: $.Codec<types.pallet_multisig.Timepoint> = _codec.$82

export interface Multisig {
  when: types.pallet_multisig.Timepoint
  deposit: types.u128
  depositor: types.sp_core.crypto.AccountId32
  approvals: Array<types.sp_core.crypto.AccountId32>
}

export function Multisig(value: types.pallet_multisig.Multisig) {
  return value
}

export interface Timepoint {
  height: types.u32
  index: types.u32
}

export function Timepoint(value: types.pallet_multisig.Timepoint) {
  return value
}
