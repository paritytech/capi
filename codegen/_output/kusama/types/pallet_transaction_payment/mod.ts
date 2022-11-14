import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export type ChargeTransactionPayment = types.Compact<types.u128>

export function ChargeTransactionPayment(
  value: types.pallet_transaction_payment.ChargeTransactionPayment,
) {
  return value
}

export type Releases = "V1Ancient" | "V2"
