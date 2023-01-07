import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $chargeTransactionPayment: $.Codec<
  types.pallet_transaction_payment.ChargeTransactionPayment
> = codecs.$726
export type ChargeTransactionPayment = types.Compact<types.u128>

export function ChargeTransactionPayment(
  value: types.pallet_transaction_payment.ChargeTransactionPayment,
) {
  return value
}

export const $releases: $.Codec<types.pallet_transaction_payment.Releases> = codecs.$477
export type Releases = "V1Ancient" | "V2"
