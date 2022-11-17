import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export interface AccountData {
  free: types.u128
  reserved: types.u128
  miscFrozen: types.u128
  feeFrozen: types.u128
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

export type Releases = "V100" | "V200"

export interface ReserveData {
  id: Uint8Array
  amount: types.u128
}

export function ReserveData(value: types.pallet_balances.ReserveData) {
  return value
}
