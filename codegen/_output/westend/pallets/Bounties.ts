import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Number of bounty proposals that have been made. */
export const BountyCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Bounties",
  "BountyCount",
  $.tuple(),
  codecs.$4,
)

/** Bounties that have been made. */
export const Bounties = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Bounties",
  "Bounties",
  $.tuple(codecs.$4),
  codecs.$591,
)

/** The description of each bounty. */
export const BountyDescriptions = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Bounties",
  "BountyDescriptions",
  $.tuple(codecs.$4),
  codecs.$593,
)

/** Bounty indices that have been approved but not yet funded. */
export const BountyApprovals = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Bounties",
  "BountyApprovals",
  $.tuple(),
  codecs.$557,
)

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
export function proposeBounty(
  value: Omit<types.pallet_bounties.pallet.Call.proposeBounty, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "proposeBounty" } }
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
export function approveBounty(
  value: Omit<types.pallet_bounties.pallet.Call.approveBounty, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "approveBounty" } }
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
export function proposeCurator(
  value: Omit<types.pallet_bounties.pallet.Call.proposeCurator, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "proposeCurator" } }
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
export function unassignCurator(
  value: Omit<types.pallet_bounties.pallet.Call.unassignCurator, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "unassignCurator" } }
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
export function acceptCurator(
  value: Omit<types.pallet_bounties.pallet.Call.acceptCurator, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "acceptCurator" } }
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
export function awardBounty(
  value: Omit<types.pallet_bounties.pallet.Call.awardBounty, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "awardBounty" } }
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
export function claimBounty(
  value: Omit<types.pallet_bounties.pallet.Call.claimBounty, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "claimBounty" } }
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
export function closeBounty(
  value: Omit<types.pallet_bounties.pallet.Call.closeBounty, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "closeBounty" } }
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
export function extendBountyExpiry(
  value: Omit<types.pallet_bounties.pallet.Call.extendBountyExpiry, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Bounties", value: { ...value, type: "extendBountyExpiry" } }
}
