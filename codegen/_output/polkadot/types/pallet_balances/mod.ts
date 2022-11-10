import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $accountData: $.Codec<t.types.pallet_balances.AccountData> = _codec.$5

export const $balanceLock: $.Codec<t.types.pallet_balances.BalanceLock> = _codec.$471

export const $reasons: $.Codec<t.types.pallet_balances.Reasons> = _codec.$472

export const $releases: $.Codec<t.types.pallet_balances.Releases> = _codec.$477

export const $reserveData: $.Codec<t.types.pallet_balances.ReserveData> = _codec.$475

export interface AccountData {
  free: t.types.u128
  reserved: t.types.u128
  misc_frozen: t.types.u128
  fee_frozen: t.types.u128
}

export function AccountData(value: t.types.pallet_balances.AccountData) {
  return value
}

export interface BalanceLock {
  id: Uint8Array
  amount: t.types.u128
  reasons: t.types.pallet_balances.Reasons
}

export function BalanceLock(value: t.types.pallet_balances.BalanceLock) {
  return value
}

export type Reasons = "Fee" | "Misc" | "All"

export type Releases = "V1_0_0" | "V2_0_0"

export interface ReserveData {
  id: Uint8Array
  amount: t.types.u128
}

export function ReserveData(value: t.types.pallet_balances.ReserveData) {
  return value
}
