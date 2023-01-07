import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Number of proposals that have been made. */
export const ProposalCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Treasury",
  "ProposalCount",
  $.tuple(),
  codecs.$4,
)

/** Proposals that have been made. */
export const Proposals = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Treasury",
  "Proposals",
  $.tuple(codecs.$4),
  codecs.$551,
)

/** Proposal indices that have been approved but not yet awarded. */
export const Approvals = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Treasury",
  "Approvals",
  $.tuple(),
  codecs.$552,
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
export function proposeSpend(value: Omit<types.pallet_treasury.pallet.Call.proposeSpend, "type">) {
  return { type: "Treasury", value: { ...value, type: "proposeSpend" } }
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
export function rejectProposal(
  value: Omit<types.pallet_treasury.pallet.Call.rejectProposal, "type">,
) {
  return { type: "Treasury", value: { ...value, type: "rejectProposal" } }
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
export function approveProposal(
  value: Omit<types.pallet_treasury.pallet.Call.approveProposal, "type">,
) {
  return { type: "Treasury", value: { ...value, type: "approveProposal" } }
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
export function spend(value: Omit<types.pallet_treasury.pallet.Call.spend, "type">) {
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
export function removeApproval(
  value: Omit<types.pallet_treasury.pallet.Call.removeApproval, "type">,
) {
  return { type: "Treasury", value: { ...value, type: "removeApproval" } }
}

/**
 *  Fraction of a proposal's value that should be bonded in order to place the proposal.
 *  An accepted proposal gets these back. A rejected proposal does not.
 */
export const ProposalBond: types.sp_arithmetic.per_things.Permill = codecs.$553.decode(
  C.hex.decode("50c30000" as C.Hex),
)

/** Minimum amount of funds that should be placed in a deposit for making a proposal. */
export const ProposalBondMinimum: types.u128 = codecs.$6.decode(
  C.hex.decode("0010a5d4e80000000000000000000000" as C.Hex),
)

/** Maximum amount of funds that should be placed in a deposit for making a proposal. */
export const ProposalBondMaximum: types.u128 | undefined = codecs.$554.decode(
  C.hex.decode("01005039278c0400000000000000000000" as C.Hex),
)

/** Period between successive spends. */
export const SpendPeriod: types.u32 = codecs.$4.decode(C.hex.decode("00460500" as C.Hex))

/** Percentage of spare funds (if any) that are burnt per spend period. */
export const Burn: types.sp_arithmetic.per_things.Permill = codecs.$553.decode(
  C.hex.decode("10270000" as C.Hex),
)

/** The treasury's pallet id, used for deriving its sovereign account ID. */
export const PalletId: types.frame_support.PalletId = codecs.$555.decode(
  C.hex.decode("70792f7472737279" as C.Hex),
)

/**
 *  The maximum number of approvals that can wait in the spending queue.
 *
 *  NOTE: This parameter is also used within the Bounties Pallet extension if enabled.
 */
export const MaxApprovals: types.u32 = codecs.$4.decode(C.hex.decode("64000000" as C.Hex))
