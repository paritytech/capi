import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Number of proposals that have been made. */
export const ProposalCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Treasury",
  "ProposalCount",
  $.tuple(),
  _codec.$4,
)

/** Proposals that have been made. */
export const Proposals = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Treasury",
  "Proposals",
  $.tuple(_codec.$4),
  _codec.$556,
)

/** Proposal indices that have been approved but not yet awarded. */
export const Approvals = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Treasury",
  "Approvals",
  $.tuple(),
  _codec.$557,
)

/**
 * Put forward a suggestion for spending. A deposit proportional to the value
 * is reserved and slashed if the proposal is rejected. It is returned once the
 * proposal is awarded.
 *
 * # <weight>
 * - Complexity: O(1)
 * - DbReads: `ProposalCount`, `origin account`
 * - DbWrites: `ProposalCount`, `Proposals`, `origin account`
 * # </weight>
 */
export function propose_spend(
  value: Omit<types.pallet_treasury.pallet.Call.propose_spend, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "propose_spend" } }
}

/**
 * Reject a proposed spend. The original deposit will be slashed.
 *
 * May only be called from `T::RejectOrigin`.
 *
 * # <weight>
 * - Complexity: O(1)
 * - DbReads: `Proposals`, `rejected proposer account`
 * - DbWrites: `Proposals`, `rejected proposer account`
 * # </weight>
 */
export function reject_proposal(
  value: Omit<types.pallet_treasury.pallet.Call.reject_proposal, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "reject_proposal" } }
}

/**
 * Approve a proposal. At a later time, the proposal will be allocated to the beneficiary
 * and the original deposit will be returned.
 *
 * May only be called from `T::ApproveOrigin`.
 *
 * # <weight>
 * - Complexity: O(1).
 * - DbReads: `Proposals`, `Approvals`
 * - DbWrite: `Approvals`
 * # </weight>
 */
export function approve_proposal(
  value: Omit<types.pallet_treasury.pallet.Call.approve_proposal, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "approve_proposal" } }
}

/**
 * Propose and approve a spend of treasury funds.
 *
 * - `origin`: Must be `SpendOrigin` with the `Success` value being at least `amount`.
 * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
 * - `beneficiary`: The destination account for the transfer.
 *
 * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
 * beneficiary.
 */
export function spend(
  value: Omit<types.pallet_treasury.pallet.Call.spend, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "spend" } }
}

/**
 * Force a previously approved proposal to be removed from the approval queue.
 * The original deposit will no longer be returned.
 *
 * May only be called from `T::RejectOrigin`.
 * - `proposal_id`: The index of a proposal
 *
 * # <weight>
 * - Complexity: O(A) where `A` is the number of approvals
 * - Db reads and writes: `Approvals`
 * # </weight>
 *
 * Errors:
 * - `ProposalNotApproved`: The `proposal_id` supplied was not found in the approval queue,
 * i.e., the proposal has not been approved. This could also mean the proposal does not
 * exist altogether, thus there is no way it would have been approved in the first place.
 */
export function remove_approval(
  value: Omit<types.pallet_treasury.pallet.Call.remove_approval, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "remove_approval" } }
}
