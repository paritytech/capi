import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
/** Proposal indices that have been approved but not yet awarded. */
export const Approvals = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$557,
}

/** Number of proposals that have been made. */
export const ProposalCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Proposals that have been made. */
export const Proposals = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$556,
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
  value: Omit<t.pallet_treasury.pallet.Call.approve_proposal, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "approve_proposal" } }
}

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
  value: Omit<t.pallet_treasury.pallet.Call.propose_spend, "type">,
): t.polkadot_runtime.RuntimeCall {
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
  value: Omit<t.pallet_treasury.pallet.Call.reject_proposal, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "reject_proposal" } }
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
  value: Omit<t.pallet_treasury.pallet.Call.remove_approval, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "remove_approval" } }
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
  value: Omit<t.pallet_treasury.pallet.Call.spend, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Treasury", value: { ...value, type: "spend" } }
}
