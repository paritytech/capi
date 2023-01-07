import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $event: $.Codec<types.pallet_transaction_payment.pallet.Event> = codecs.$38
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event = types.pallet_transaction_payment.pallet.Event.TransactionFeePaid
export namespace Event {
  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  export interface TransactionFeePaid {
    type: "TransactionFeePaid"
    who: types.sp_core.crypto.AccountId32
    actualFee: types.u128
    tip: types.u128
  }
  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  export function TransactionFeePaid(
    value: Omit<types.pallet_transaction_payment.pallet.Event.TransactionFeePaid, "type">,
  ): types.pallet_transaction_payment.pallet.Event.TransactionFeePaid {
    return { type: "TransactionFeePaid", ...value }
  }
}
