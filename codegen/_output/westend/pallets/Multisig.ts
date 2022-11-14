import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The set of open multisig operations. */
export const Multisigs = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Multisig",
  "Multisigs",
  _codec.$588,
  _codec.$589,
)

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
  value: Omit<types.pallet_multisig.pallet.Call.as_multi_threshold_1, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Multisig", value: { ...value, type: "as_multi_threshold_1" } }
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
  value: Omit<types.pallet_multisig.pallet.Call.as_multi, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Multisig", value: { ...value, type: "as_multi" } }
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
  value: Omit<types.pallet_multisig.pallet.Call.approve_as_multi, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Multisig", value: { ...value, type: "approve_as_multi" } }
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
  value: Omit<types.pallet_multisig.pallet.Call.cancel_as_multi, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Multisig", value: { ...value, type: "cancel_as_multi" } }
}
