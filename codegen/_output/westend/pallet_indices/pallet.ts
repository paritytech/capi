import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_indices.pallet.Call> = _codec.$196

export const $error: $.Codec<t.pallet_indices.pallet.Error> = _codec.$469

export const $event: $.Codec<t.pallet_indices.pallet.Event> = _codec.$35

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_indices.pallet.Call.claim
  | t.pallet_indices.pallet.Call.transfer
  | t.pallet_indices.pallet.Call.free
  | t.pallet_indices.pallet.Call.force_transfer
  | t.pallet_indices.pallet.Call.freeze
export namespace Call {
  /**
   * Assign an previously unassigned index.
   *
   * Payment: `Deposit` is reserved from the sender account.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `index`: the index to be claimed. This must not be in use.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One reserve operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export interface claim {
    type: "claim"
    index: t.u32
  }
  /**
   * Assign an index already owned by the sender to another account. The balance reservation
   * is effectively transferred to the new account.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `index`: the index to be re-assigned. This must be owned by the sender.
   * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One transfer operation.
   * - One event.
   * -------------------
   * - DB Weight:
   *    - Reads: Indices Accounts, System Account (recipient)
   *    - Writes: Indices Accounts, System Account (recipient)
   * # </weight>
   */
  export interface transfer {
    type: "transfer"
    new: t.sp_runtime.multiaddress.MultiAddress
    index: t.u32
  }
  /**
   * Free up an index owned by the sender.
   *
   * Payment: Any previous deposit placed for the index is unreserved in the sender account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must own the index.
   *
   * - `index`: the index to be freed. This must be owned by the sender.
   *
   * Emits `IndexFreed` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One reserve operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export interface free {
    type: "free"
    index: t.u32
  }
  /**
   * Force an index to an account. This doesn't require a deposit. If the index is already
   * held, then any deposit is reimbursed to its current owner.
   *
   * The dispatch origin for this call must be _Root_.
   *
   * - `index`: the index to be (re-)assigned.
   * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
   * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - Up to one reserve operation.
   * - One event.
   * -------------------
   * - DB Weight:
   *    - Reads: Indices Accounts, System Account (original owner)
   *    - Writes: Indices Accounts, System Account (original owner)
   * # </weight>
   */
  export interface force_transfer {
    type: "force_transfer"
    new: t.sp_runtime.multiaddress.MultiAddress
    index: t.u32
    freeze: boolean
  }
  /**
   * Freeze an index so it will always point to the sender account. This consumes the
   * deposit.
   *
   * The dispatch origin for this call must be _Signed_ and the signing account must have a
   * non-frozen account `index`.
   *
   * - `index`: the index to be frozen in place.
   *
   * Emits `IndexFrozen` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - Up to one slash operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export interface freeze {
    type: "freeze"
    index: t.u32
  }
  /**
   * Assign an previously unassigned index.
   *
   * Payment: `Deposit` is reserved from the sender account.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `index`: the index to be claimed. This must not be in use.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One reserve operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export function claim(
    value: Omit<t.pallet_indices.pallet.Call.claim, "type">,
  ): t.pallet_indices.pallet.Call.claim {
    return { type: "claim", ...value }
  }
  /**
   * Assign an index already owned by the sender to another account. The balance reservation
   * is effectively transferred to the new account.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `index`: the index to be re-assigned. This must be owned by the sender.
   * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One transfer operation.
   * - One event.
   * -------------------
   * - DB Weight:
   *    - Reads: Indices Accounts, System Account (recipient)
   *    - Writes: Indices Accounts, System Account (recipient)
   * # </weight>
   */
  export function transfer(
    value: Omit<t.pallet_indices.pallet.Call.transfer, "type">,
  ): t.pallet_indices.pallet.Call.transfer {
    return { type: "transfer", ...value }
  }
  /**
   * Free up an index owned by the sender.
   *
   * Payment: Any previous deposit placed for the index is unreserved in the sender account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must own the index.
   *
   * - `index`: the index to be freed. This must be owned by the sender.
   *
   * Emits `IndexFreed` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - One reserve operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export function free(
    value: Omit<t.pallet_indices.pallet.Call.free, "type">,
  ): t.pallet_indices.pallet.Call.free {
    return { type: "free", ...value }
  }
  /**
   * Force an index to an account. This doesn't require a deposit. If the index is already
   * held, then any deposit is reimbursed to its current owner.
   *
   * The dispatch origin for this call must be _Root_.
   *
   * - `index`: the index to be (re-)assigned.
   * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
   * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
   *
   * Emits `IndexAssigned` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - Up to one reserve operation.
   * - One event.
   * -------------------
   * - DB Weight:
   *    - Reads: Indices Accounts, System Account (original owner)
   *    - Writes: Indices Accounts, System Account (original owner)
   * # </weight>
   */
  export function force_transfer(
    value: Omit<t.pallet_indices.pallet.Call.force_transfer, "type">,
  ): t.pallet_indices.pallet.Call.force_transfer {
    return { type: "force_transfer", ...value }
  }
  /**
   * Freeze an index so it will always point to the sender account. This consumes the
   * deposit.
   *
   * The dispatch origin for this call must be _Signed_ and the signing account must have a
   * non-frozen account `index`.
   *
   * - `index`: the index to be frozen in place.
   *
   * Emits `IndexFrozen` if successful.
   *
   * # <weight>
   * - `O(1)`.
   * - One storage mutation (codec `O(1)`).
   * - Up to one slash operation.
   * - One event.
   * -------------------
   * - DB Weight: 1 Read/Write (Accounts)
   * # </weight>
   */
  export function freeze(
    value: Omit<t.pallet_indices.pallet.Call.freeze, "type">,
  ): t.pallet_indices.pallet.Call.freeze {
    return { type: "freeze", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "NotAssigned" | "NotOwner" | "InUse" | "NotTransfer" | "Permanent"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_indices.pallet.Event.IndexAssigned
  | t.pallet_indices.pallet.Event.IndexFreed
  | t.pallet_indices.pallet.Event.IndexFrozen
export namespace Event {
  /** A account index was assigned. */
  export interface IndexAssigned {
    type: "IndexAssigned"
    who: t.sp_core.crypto.AccountId32
    index: t.u32
  }
  /** A account index has been freed up (unassigned). */
  export interface IndexFreed {
    type: "IndexFreed"
    index: t.u32
  }
  /** A account index has been frozen to its current account ID. */
  export interface IndexFrozen {
    type: "IndexFrozen"
    index: t.u32
    who: t.sp_core.crypto.AccountId32
  }
  /** A account index was assigned. */
  export function IndexAssigned(
    value: Omit<t.pallet_indices.pallet.Event.IndexAssigned, "type">,
  ): t.pallet_indices.pallet.Event.IndexAssigned {
    return { type: "IndexAssigned", ...value }
  }
  /** A account index has been freed up (unassigned). */
  export function IndexFreed(
    value: Omit<t.pallet_indices.pallet.Event.IndexFreed, "type">,
  ): t.pallet_indices.pallet.Event.IndexFreed {
    return { type: "IndexFreed", ...value }
  }
  /** A account index has been frozen to its current account ID. */
  export function IndexFrozen(
    value: Omit<t.pallet_indices.pallet.Event.IndexFrozen, "type">,
  ): t.pallet_indices.pallet.Event.IndexFrozen {
    return { type: "IndexFrozen", ...value }
  }
}
