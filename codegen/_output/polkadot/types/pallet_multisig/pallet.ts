import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_multisig.pallet.Call> = _codec.$305

export const $error: $.Codec<t.types.pallet_multisig.pallet.Error> = _codec.$590

export const $event: $.Codec<t.types.pallet_multisig.pallet.Event> = _codec.$81

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_multisig.pallet.Call.as_multi_threshold_1
  | t.types.pallet_multisig.pallet.Call.as_multi
  | t.types.pallet_multisig.pallet.Call.approve_as_multi
  | t.types.pallet_multisig.pallet.Call.cancel_as_multi
export namespace Call {
  /**
   * Immediately dispatch a multi-signature call using a single approval from the caller.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `other_signatories`: The accounts (other than the sender) who are part of the
   * multi-signature, but do not participate in the approval process.
   * - `call`: The call to be executed.
   *
   * Result is equivalent to the dispatched result.
   *
   * # <weight>
   * O(Z + C) where Z is the length of the call and C its execution weight.
   * -------------------------------
   * - DB Weight: None
   * - Plus Call Weight
   * # </weight>
   */
  export interface as_multi_threshold_1 {
    type: "as_multi_threshold_1"
    other_signatories: Array<t.types.sp_core.crypto.AccountId32>
    call: t.types.polkadot_runtime.RuntimeCall
  }
  /**
   * Register approval for a dispatch to be made from a deterministic composite account if
   * approved by a total of `threshold - 1` of `other_signatories`.
   *
   * If there are enough, then dispatch the call.
   *
   * Payment: `DepositBase` will be reserved if this is the first approval, plus
   * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
   * is cancelled.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
   * not the first approval, then it must be `Some`, with the timepoint (block number and
   * transaction index) of the first approval transaction.
   * - `call`: The call to be executed.
   *
   * NOTE: Unless this is the final approval, you will generally want to use
   * `approve_as_multi` instead, since it only requires a hash of the call.
   *
   * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
   * on success, result is `Ok` and the result from the interior call, if it was executed,
   * may be found in the deposited `MultisigExecuted` event.
   *
   * # <weight>
   * - `O(S + Z + Call)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
   * - One encode & hash, both of complexity `O(S)`.
   * - Up to one binary search and insert (`O(logS + S)`).
   * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
   * - One event.
   * - The weight of the `call`.
   * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
   *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
   * -------------------------------
   * - DB Weight:
   *     - Reads: Multisig Storage, [Caller Account]
   *     - Writes: Multisig Storage, [Caller Account]
   * - Plus Call Weight
   * # </weight>
   */
  export interface as_multi {
    type: "as_multi"
    threshold: t.types.u16
    other_signatories: Array<t.types.sp_core.crypto.AccountId32>
    maybe_timepoint: t.types.pallet_multisig.Timepoint | undefined
    call: t.types.polkadot_runtime.RuntimeCall
    max_weight: t.types.sp_weights.weight_v2.Weight
  }
  /**
   * Register approval for a dispatch to be made from a deterministic composite account if
   * approved by a total of `threshold - 1` of `other_signatories`.
   *
   * Payment: `DepositBase` will be reserved if this is the first approval, plus
   * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
   * is cancelled.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
   * not the first approval, then it must be `Some`, with the timepoint (block number and
   * transaction index) of the first approval transaction.
   * - `call_hash`: The hash of the call to be executed.
   *
   * NOTE: If this is the final approval, you will want to use `as_multi` instead.
   *
   * # <weight>
   * - `O(S)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One encode & hash, both of complexity `O(S)`.
   * - Up to one binary search and insert (`O(logS + S)`).
   * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
   * - One event.
   * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
   *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
   * ----------------------------------
   * - DB Weight:
   *     - Read: Multisig Storage, [Caller Account]
   *     - Write: Multisig Storage, [Caller Account]
   * # </weight>
   */
  export interface approve_as_multi {
    type: "approve_as_multi"
    threshold: t.types.u16
    other_signatories: Array<t.types.sp_core.crypto.AccountId32>
    maybe_timepoint: t.types.pallet_multisig.Timepoint | undefined
    call_hash: Uint8Array
    max_weight: t.types.sp_weights.weight_v2.Weight
  }
  /**
   * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
   * for this operation will be unreserved on success.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `timepoint`: The timepoint (block number and transaction index) of the first approval
   * transaction for this dispatch.
   * - `call_hash`: The hash of the call to be executed.
   *
   * # <weight>
   * - `O(S)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One encode & hash, both of complexity `O(S)`.
   * - One event.
   * - I/O: 1 read `O(S)`, one remove.
   * - Storage: removes one item.
   * ----------------------------------
   * - DB Weight:
   *     - Read: Multisig Storage, [Caller Account], Refund Account
   *     - Write: Multisig Storage, [Caller Account], Refund Account
   * # </weight>
   */
  export interface cancel_as_multi {
    type: "cancel_as_multi"
    threshold: t.types.u16
    other_signatories: Array<t.types.sp_core.crypto.AccountId32>
    timepoint: t.types.pallet_multisig.Timepoint
    call_hash: Uint8Array
  }
  /**
   * Immediately dispatch a multi-signature call using a single approval from the caller.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `other_signatories`: The accounts (other than the sender) who are part of the
   * multi-signature, but do not participate in the approval process.
   * - `call`: The call to be executed.
   *
   * Result is equivalent to the dispatched result.
   *
   * # <weight>
   * O(Z + C) where Z is the length of the call and C its execution weight.
   * -------------------------------
   * - DB Weight: None
   * - Plus Call Weight
   * # </weight>
   */
  export function as_multi_threshold_1(
    value: Omit<t.types.pallet_multisig.pallet.Call.as_multi_threshold_1, "type">,
  ): t.types.pallet_multisig.pallet.Call.as_multi_threshold_1 {
    return { type: "as_multi_threshold_1", ...value }
  }
  /**
   * Register approval for a dispatch to be made from a deterministic composite account if
   * approved by a total of `threshold - 1` of `other_signatories`.
   *
   * If there are enough, then dispatch the call.
   *
   * Payment: `DepositBase` will be reserved if this is the first approval, plus
   * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
   * is cancelled.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
   * not the first approval, then it must be `Some`, with the timepoint (block number and
   * transaction index) of the first approval transaction.
   * - `call`: The call to be executed.
   *
   * NOTE: Unless this is the final approval, you will generally want to use
   * `approve_as_multi` instead, since it only requires a hash of the call.
   *
   * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
   * on success, result is `Ok` and the result from the interior call, if it was executed,
   * may be found in the deposited `MultisigExecuted` event.
   *
   * # <weight>
   * - `O(S + Z + Call)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
   * - One encode & hash, both of complexity `O(S)`.
   * - Up to one binary search and insert (`O(logS + S)`).
   * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
   * - One event.
   * - The weight of the `call`.
   * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
   *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
   * -------------------------------
   * - DB Weight:
   *     - Reads: Multisig Storage, [Caller Account]
   *     - Writes: Multisig Storage, [Caller Account]
   * - Plus Call Weight
   * # </weight>
   */
  export function as_multi(
    value: Omit<t.types.pallet_multisig.pallet.Call.as_multi, "type">,
  ): t.types.pallet_multisig.pallet.Call.as_multi {
    return { type: "as_multi", ...value }
  }
  /**
   * Register approval for a dispatch to be made from a deterministic composite account if
   * approved by a total of `threshold - 1` of `other_signatories`.
   *
   * Payment: `DepositBase` will be reserved if this is the first approval, plus
   * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
   * is cancelled.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
   * not the first approval, then it must be `Some`, with the timepoint (block number and
   * transaction index) of the first approval transaction.
   * - `call_hash`: The hash of the call to be executed.
   *
   * NOTE: If this is the final approval, you will want to use `as_multi` instead.
   *
   * # <weight>
   * - `O(S)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One encode & hash, both of complexity `O(S)`.
   * - Up to one binary search and insert (`O(logS + S)`).
   * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
   * - One event.
   * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
   *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
   * ----------------------------------
   * - DB Weight:
   *     - Read: Multisig Storage, [Caller Account]
   *     - Write: Multisig Storage, [Caller Account]
   * # </weight>
   */
  export function approve_as_multi(
    value: Omit<t.types.pallet_multisig.pallet.Call.approve_as_multi, "type">,
  ): t.types.pallet_multisig.pallet.Call.approve_as_multi {
    return { type: "approve_as_multi", ...value }
  }
  /**
   * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
   * for this operation will be unreserved on success.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `threshold`: The total number of approvals for this dispatch before it is executed.
   * - `other_signatories`: The accounts (other than the sender) who can approve this
   * dispatch. May not be empty.
   * - `timepoint`: The timepoint (block number and transaction index) of the first approval
   * transaction for this dispatch.
   * - `call_hash`: The hash of the call to be executed.
   *
   * # <weight>
   * - `O(S)`.
   * - Up to one balance-reserve or unreserve operation.
   * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
   *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
   * - One encode & hash, both of complexity `O(S)`.
   * - One event.
   * - I/O: 1 read `O(S)`, one remove.
   * - Storage: removes one item.
   * ----------------------------------
   * - DB Weight:
   *     - Read: Multisig Storage, [Caller Account], Refund Account
   *     - Write: Multisig Storage, [Caller Account], Refund Account
   * # </weight>
   */
  export function cancel_as_multi(
    value: Omit<t.types.pallet_multisig.pallet.Call.cancel_as_multi, "type">,
  ): t.types.pallet_multisig.pallet.Call.cancel_as_multi {
    return { type: "cancel_as_multi", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "MinimumThreshold"
  | "AlreadyApproved"
  | "NoApprovalsNeeded"
  | "TooFewSignatories"
  | "TooManySignatories"
  | "SignatoriesOutOfOrder"
  | "SenderInSignatories"
  | "NotFound"
  | "NotOwner"
  | "NoTimepoint"
  | "WrongTimepoint"
  | "UnexpectedTimepoint"
  | "MaxWeightTooLow"
  | "AlreadyStored"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.pallet_multisig.pallet.Event.NewMultisig
  | t.types.pallet_multisig.pallet.Event.MultisigApproval
  | t.types.pallet_multisig.pallet.Event.MultisigExecuted
  | t.types.pallet_multisig.pallet.Event.MultisigCancelled
export namespace Event {
  /** A new multisig operation has begun. */
  export interface NewMultisig {
    type: "NewMultisig"
    approving: t.types.sp_core.crypto.AccountId32
    multisig: t.types.sp_core.crypto.AccountId32
    call_hash: Uint8Array
  }
  /** A multisig operation has been approved by someone. */
  export interface MultisigApproval {
    type: "MultisigApproval"
    approving: t.types.sp_core.crypto.AccountId32
    timepoint: t.types.pallet_multisig.Timepoint
    multisig: t.types.sp_core.crypto.AccountId32
    call_hash: Uint8Array
  }
  /** A multisig operation has been executed. */
  export interface MultisigExecuted {
    type: "MultisigExecuted"
    approving: t.types.sp_core.crypto.AccountId32
    timepoint: t.types.pallet_multisig.Timepoint
    multisig: t.types.sp_core.crypto.AccountId32
    call_hash: Uint8Array
    result: null | C.ChainError<t.types.sp_runtime.DispatchError>
  }
  /** A multisig operation has been cancelled. */
  export interface MultisigCancelled {
    type: "MultisigCancelled"
    cancelling: t.types.sp_core.crypto.AccountId32
    timepoint: t.types.pallet_multisig.Timepoint
    multisig: t.types.sp_core.crypto.AccountId32
    call_hash: Uint8Array
  }
  /** A new multisig operation has begun. */
  export function NewMultisig(
    value: Omit<t.types.pallet_multisig.pallet.Event.NewMultisig, "type">,
  ): t.types.pallet_multisig.pallet.Event.NewMultisig {
    return { type: "NewMultisig", ...value }
  }
  /** A multisig operation has been approved by someone. */
  export function MultisigApproval(
    value: Omit<t.types.pallet_multisig.pallet.Event.MultisigApproval, "type">,
  ): t.types.pallet_multisig.pallet.Event.MultisigApproval {
    return { type: "MultisigApproval", ...value }
  }
  /** A multisig operation has been executed. */
  export function MultisigExecuted(
    value: Omit<t.types.pallet_multisig.pallet.Event.MultisigExecuted, "type">,
  ): t.types.pallet_multisig.pallet.Event.MultisigExecuted {
    return { type: "MultisigExecuted", ...value }
  }
  /** A multisig operation has been cancelled. */
  export function MultisigCancelled(
    value: Omit<t.types.pallet_multisig.pallet.Event.MultisigCancelled, "type">,
  ): t.types.pallet_multisig.pallet.Event.MultisigCancelled {
    return { type: "MultisigCancelled", ...value }
  }
}
