import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $event: $.Codec<t.pallet_transaction_payment.pallet.Event> = _codec.$38

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event = t.pallet_transaction_payment.pallet.Event.TransactionFeePaid
export namespace Event {
  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  export interface TransactionFeePaid {
    type: "TransactionFeePaid"
    who: t.sp_core.crypto.AccountId32
    actual_fee: t.u128
    tip: t.u128
  }
  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  export function TransactionFeePaid(
    value: Omit<t.pallet_transaction_payment.pallet.Event.TransactionFeePaid, "type">,
  ): t.pallet_transaction_payment.pallet.Event.TransactionFeePaid {
    return { type: "TransactionFeePaid", ...value }
  }
}
