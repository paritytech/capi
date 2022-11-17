import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_multisig.pallet.Call.asMultiThreshold1
  | types.pallet_multisig.pallet.Call.asMulti
  | types.pallet_multisig.pallet.Call.approveAsMulti
  | types.pallet_multisig.pallet.Call.cancelAsMulti
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
  export interface asMultiThreshold1 {
    type: "asMultiThreshold1"
    otherSignatories: Array<types.sp_core.crypto.AccountId32>
    call: types.polkadot_runtime.RuntimeCall
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
  export interface asMulti {
    type: "asMulti"
    threshold: types.u16
    otherSignatories: Array<types.sp_core.crypto.AccountId32>
    maybeTimepoint: types.pallet_multisig.Timepoint | undefined
    call: types.polkadot_runtime.RuntimeCall
    maxWeight: types.sp_weights.weight_v2.Weight
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
  export interface approveAsMulti {
    type: "approveAsMulti"
    threshold: types.u16
    otherSignatories: Array<types.sp_core.crypto.AccountId32>
    maybeTimepoint: types.pallet_multisig.Timepoint | undefined
    callHash: Uint8Array
    maxWeight: types.sp_weights.weight_v2.Weight
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
  export interface cancelAsMulti {
    type: "cancelAsMulti"
    threshold: types.u16
    otherSignatories: Array<types.sp_core.crypto.AccountId32>
    timepoint: types.pallet_multisig.Timepoint
    callHash: Uint8Array
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
  export function asMultiThreshold1(
    value: Omit<types.pallet_multisig.pallet.Call.asMultiThreshold1, "type">,
  ): types.pallet_multisig.pallet.Call.asMultiThreshold1 {
    return { type: "asMultiThreshold1", ...value }
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
  export function asMulti(
    value: Omit<types.pallet_multisig.pallet.Call.asMulti, "type">,
  ): types.pallet_multisig.pallet.Call.asMulti {
    return { type: "asMulti", ...value }
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
  export function approveAsMulti(
    value: Omit<types.pallet_multisig.pallet.Call.approveAsMulti, "type">,
  ): types.pallet_multisig.pallet.Call.approveAsMulti {
    return { type: "approveAsMulti", ...value }
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
  export function cancelAsMulti(
    value: Omit<types.pallet_multisig.pallet.Call.cancelAsMulti, "type">,
  ): types.pallet_multisig.pallet.Call.cancelAsMulti {
    return { type: "cancelAsMulti", ...value }
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
  | types.pallet_multisig.pallet.Event.NewMultisig
  | types.pallet_multisig.pallet.Event.MultisigApproval
  | types.pallet_multisig.pallet.Event.MultisigExecuted
  | types.pallet_multisig.pallet.Event.MultisigCancelled
export namespace Event {
  /** A new multisig operation has begun. */
  export interface NewMultisig {
    type: "NewMultisig"
    approving: types.sp_core.crypto.AccountId32
    multisig: types.sp_core.crypto.AccountId32
    callHash: Uint8Array
  }
  /** A multisig operation has been approved by someone. */
  export interface MultisigApproval {
    type: "MultisigApproval"
    approving: types.sp_core.crypto.AccountId32
    timepoint: types.pallet_multisig.Timepoint
    multisig: types.sp_core.crypto.AccountId32
    callHash: Uint8Array
  }
  /** A multisig operation has been executed. */
  export interface MultisigExecuted {
    type: "MultisigExecuted"
    approving: types.sp_core.crypto.AccountId32
    timepoint: types.pallet_multisig.Timepoint
    multisig: types.sp_core.crypto.AccountId32
    callHash: Uint8Array
    result: null | C.ChainError<types.sp_runtime.DispatchError>
  }
  /** A multisig operation has been cancelled. */
  export interface MultisigCancelled {
    type: "MultisigCancelled"
    cancelling: types.sp_core.crypto.AccountId32
    timepoint: types.pallet_multisig.Timepoint
    multisig: types.sp_core.crypto.AccountId32
    callHash: Uint8Array
  }
  /** A new multisig operation has begun. */
  export function NewMultisig(
    value: Omit<types.pallet_multisig.pallet.Event.NewMultisig, "type">,
  ): types.pallet_multisig.pallet.Event.NewMultisig {
    return { type: "NewMultisig", ...value }
  }
  /** A multisig operation has been approved by someone. */
  export function MultisigApproval(
    value: Omit<types.pallet_multisig.pallet.Event.MultisigApproval, "type">,
  ): types.pallet_multisig.pallet.Event.MultisigApproval {
    return { type: "MultisigApproval", ...value }
  }
  /** A multisig operation has been executed. */
  export function MultisigExecuted(
    value: Omit<types.pallet_multisig.pallet.Event.MultisigExecuted, "type">,
  ): types.pallet_multisig.pallet.Event.MultisigExecuted {
    return { type: "MultisigExecuted", ...value }
  }
  /** A multisig operation has been cancelled. */
  export function MultisigCancelled(
    value: Omit<types.pallet_multisig.pallet.Event.MultisigCancelled, "type">,
  ): types.pallet_multisig.pallet.Event.MultisigCancelled {
    return { type: "MultisigCancelled", ...value }
  }
}
