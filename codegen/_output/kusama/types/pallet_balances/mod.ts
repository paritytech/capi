import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export interface AccountData {
  free: types.u128
  reserved: types.u128
  misc_frozen: types.u128
  fee_frozen: types.u128
}

export function AccountData(value: types.pallet_balances.AccountData) {
  return value
}

export interface BalanceLock {
  id: Uint8Array
  amount: types.u128
  reasons: types.pallet_balances.Reasons
}

export function BalanceLock(value: types.pallet_balances.BalanceLock) {
  return value
}

export type Reasons = "Fee" | "Misc" | "All"

export type Releases = "V1_0_0" | "V2_0_0"

export interface ReserveData {
  id: Uint8Array
  amount: types.u128
}

export function ReserveData(value: types.pallet_balances.ReserveData) {
  return value
}
