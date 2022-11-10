import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** Bounties that have been made. */
export const Bounties = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$591,
}

/** Bounty indices that have been approved but not yet funded. */
export const BountyApprovals = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$557,
}

/** Number of bounty proposals that have been made. */
export const BountyCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** The description of each bounty. */
export const BountyDescriptions = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$593,
}

/**
 * Accept the curator role for a bounty.
 * A deposit will be reserved from curator and refund upon successful payout.
 *
 * May only be called from the curator.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function accept_curator(
  value: Omit<t.types.pallet_bounties.pallet.Call.accept_curator, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "accept_curator" } }
}

/**
 * Approve a bounty proposal. At a later time, the bounty will be funded and become active
 * and the original deposit will be returned.
 *
 * May only be called from `T::ApproveOrigin`.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function approve_bounty(
  value: Omit<t.types.pallet_bounties.pallet.Call.approve_bounty, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "approve_bounty" } }
}

/**
 * Award bounty to a beneficiary account. The beneficiary will be able to claim the funds
 * after a delay.
 *
 * The dispatch origin for this call must be the curator of this bounty.
 *
 * - `bounty_id`: Bounty ID to award.
 * - `beneficiary`: The beneficiary account whom will receive the payout.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function award_bounty(
  value: Omit<t.types.pallet_bounties.pallet.Call.award_bounty, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "award_bounty" } }
}

/**
 * Claim the payout from an awarded bounty after payout delay.
 *
 * The dispatch origin for this call must be the beneficiary of this bounty.
 *
 * - `bounty_id`: Bounty ID to claim.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function claim_bounty(
  value: Omit<t.types.pallet_bounties.pallet.Call.claim_bounty, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "claim_bounty" } }
}

/**
 * Cancel a proposed or active bounty. All the funds will be sent to treasury and
 * the curator deposit will be unreserved if possible.
 *
 * Only `T::RejectOrigin` is able to cancel a bounty.
 *
 * - `bounty_id`: Bounty ID to cancel.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function close_bounty(
  value: Omit<t.types.pallet_bounties.pallet.Call.close_bounty, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "close_bounty" } }
}

/**
 * Extend the expiry time of an active bounty.
 *
 * The dispatch origin for this call must be the curator of this bounty.
 *
 * - `bounty_id`: Bounty ID to extend.
 * - `remark`: additional information.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function extend_bounty_expiry(
  value: Omit<t.types.pallet_bounties.pallet.Call.extend_bounty_expiry, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "extend_bounty_expiry" } }
}

/**
 * Propose a new bounty.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
 * `DataDepositPerByte` for each byte in `reason`. It will be unreserved upon approval,
 * or slashed when rejected.
 *
 * - `curator`: The curator account whom will manage this bounty.
 * - `fee`: The curator fee.
 * - `value`: The total payment amount of this bounty, curator fee included.
 * - `description`: The description of this bounty.
 */
export function propose_bounty(
  value: Omit<t.types.pallet_bounties.pallet.Call.propose_bounty, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "propose_bounty" } }
}

/**
 * Assign a curator to a funded bounty.
 *
 * May only be called from `T::ApproveOrigin`.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function propose_curator(
  value: Omit<t.types.pallet_bounties.pallet.Call.propose_curator, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "propose_curator" } }
}

/**
 * Unassign curator from a bounty.
 *
 * This function can only be called by the `RejectOrigin` a signed origin.
 *
 * If this function is called by the `RejectOrigin`, we assume that the curator is
 * malicious or inactive. As a result, we will slash the curator when possible.
 *
 * If the origin is the curator, we take this as a sign they are unable to do their job and
 * they willingly give up. We could slash them, but for now we allow them to recover their
 * deposit and exit without issue. (We may want to change this if it is abused.)
 *
 * Finally, the origin can be anyone if and only if the curator is "inactive". This allows
 * anyone in the community to call out that a curator is not doing their due diligence, and
 * we should pick a new curator. In this case the curator should also be slashed.
 *
 * # <weight>
 * - O(1).
 * # </weight>
 */
export function unassign_curator(
  value: Omit<t.types.pallet_bounties.pallet.Call.unassign_curator, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "unassign_curator" } }
}
