import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $accountData: $.Codec<t.pallet_balances.AccountData> = _codec.$5

export const $balanceLock: $.Codec<t.pallet_balances.BalanceLock> = _codec.$471

export const $reasons: $.Codec<t.pallet_balances.Reasons> = _codec.$472

export const $releases: $.Codec<t.pallet_balances.Releases> = _codec.$477

export const $reserveData: $.Codec<t.pallet_balances.ReserveData> = _codec.$475

export interface AccountData {
  free: t.u128
  reserved: t.u128
  misc_frozen: t.u128
  fee_frozen: t.u128
}

export function AccountData(value: t.pallet_balances.AccountData) {
  return value
}

export interface BalanceLock {
  id: Uint8Array
  amount: t.u128
  reasons: t.pallet_balances.Reasons
}

export function BalanceLock(value: t.pallet_balances.BalanceLock) {
  return value
}

export type Reasons = "Fee" | "Misc" | "All"

export type Releases = "V1_0_0" | "V2_0_0"

export interface ReserveData {
  id: Uint8Array
  amount: t.u128
}

export function ReserveData(value: t.pallet_balances.ReserveData) {
  return value
}
