import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $accountData: $.Codec<types.pallet_balances.AccountData> = codecs.$5
export interface AccountData {
  free: types.u128
  reserved: types.u128
  miscFrozen: types.u128
  feeFrozen: types.u128
}

export function AccountData(value: types.pallet_balances.AccountData) {
  return value
}

export const $balanceLock: $.Codec<types.pallet_balances.BalanceLock> = codecs.$468
export interface BalanceLock {
  id: Uint8Array
  amount: types.u128
  reasons: types.pallet_balances.Reasons
}

export function BalanceLock(value: types.pallet_balances.BalanceLock) {
  return value
}

export const $reasons: $.Codec<types.pallet_balances.Reasons> = codecs.$469
export type Reasons = "Fee" | "Misc" | "All"

export const $releases: $.Codec<types.pallet_balances.Releases> = codecs.$474
export type Releases = "V100" | "V200"

export const $reserveData: $.Codec<types.pallet_balances.ReserveData> = codecs.$472
export interface ReserveData {
  id: Uint8Array
  amount: types.u128
}

export function ReserveData(value: types.pallet_balances.ReserveData) {
  return value
}
