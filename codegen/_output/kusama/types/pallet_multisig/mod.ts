import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

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
