import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $multisig: $.Codec<t.pallet_multisig.Multisig> = _codec.$589

export const $timepoint: $.Codec<t.pallet_multisig.Timepoint> = _codec.$82

export interface Multisig {
  when: t.pallet_multisig.Timepoint
  deposit: t.u128
  depositor: t.sp_core.crypto.AccountId32
  approvals: Array<t.sp_core.crypto.AccountId32>
}

export function Multisig(value: t.pallet_multisig.Multisig) {
  return value
}

export interface Timepoint {
  height: t.u32
  index: t.u32
}

export function Timepoint(value: t.pallet_multisig.Timepoint) {
  return value
}
