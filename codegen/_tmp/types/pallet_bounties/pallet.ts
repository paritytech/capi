import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_bounties.pallet.Call> = codecs.$307
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_bounties.pallet.Call.proposeBounty
  | types.pallet_bounties.pallet.Call.approveBounty
  | types.pallet_bounties.pallet.Call.proposeCurator
  | types.pallet_bounties.pallet.Call.unassignCurator
  | types.pallet_bounties.pallet.Call.acceptCurator
  | types.pallet_bounties.pallet.Call.awardBounty
  | types.pallet_bounties.pallet.Call.claimBounty
  | types.pallet_bounties.pallet.Call.closeBounty
  | types.pallet_bounties.pallet.Call.extendBountyExpiry
export namespace Call {
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
  export interface proposeBounty {
    type: "proposeBounty"
    value: types.Compact<types.u128>
    description: Uint8Array
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
  export interface approveBounty {
    type: "approveBounty"
    bountyId: types.Compact<types.u32>
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
  export interface proposeCurator {
    type: "proposeCurator"
    bountyId: types.Compact<types.u32>
    curator: types.sp_runtime.multiaddress.MultiAddress
    fee: types.Compact<types.u128>
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
  export interface unassignCurator {
    type: "unassignCurator"
    bountyId: types.Compact<types.u32>
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
  export interface acceptCurator {
    type: "acceptCurator"
    bountyId: types.Compact<types.u32>
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
  export interface awardBounty {
    type: "awardBounty"
    bountyId: types.Compact<types.u32>
    beneficiary: types.sp_runtime.multiaddress.MultiAddress
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
  export interface claimBounty {
    type: "claimBounty"
    bountyId: types.Compact<types.u32>
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
  export interface closeBounty {
    type: "closeBounty"
    bountyId: types.Compact<types.u32>
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
  export interface extendBountyExpiry {
    type: "extendBountyExpiry"
    bountyId: types.Compact<types.u32>
    remark: Uint8Array
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
  export function proposeBounty(
    value: Omit<types.pallet_bounties.pallet.Call.proposeBounty, "type">,
  ): types.pallet_bounties.pallet.Call.proposeBounty {
    return { type: "proposeBounty", ...value }
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
  ): types.pallet_bounties.pallet.Call.approveBounty {
    return { type: "approveBounty", ...value }
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
  ): types.pallet_bounties.pallet.Call.proposeCurator {
    return { type: "proposeCurator", ...value }
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
  ): types.pallet_bounties.pallet.Call.unassignCurator {
    return { type: "unassignCurator", ...value }
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
  ): types.pallet_bounties.pallet.Call.acceptCurator {
    return { type: "acceptCurator", ...value }
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
  ): types.pallet_bounties.pallet.Call.awardBounty {
    return { type: "awardBounty", ...value }
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
  ): types.pallet_bounties.pallet.Call.claimBounty {
    return { type: "claimBounty", ...value }
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
  ): types.pallet_bounties.pallet.Call.closeBounty {
    return { type: "closeBounty", ...value }
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
  ): types.pallet_bounties.pallet.Call.extendBountyExpiry {
    return { type: "extendBountyExpiry", ...value }
  }
}

export const $error: $.Codec<types.pallet_bounties.pallet.Error> = codecs.$590
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "InsufficientProposersBalance"
  | "InvalidIndex"
  | "ReasonTooBig"
  | "UnexpectedStatus"
  | "RequireCurator"
  | "InvalidValue"
  | "InvalidFee"
  | "PendingPayout"
  | "Premature"
  | "HasActiveChildBounty"
  | "TooManyQueued"

export const $event: $.Codec<types.pallet_bounties.pallet.Event> = codecs.$84
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_bounties.pallet.Event.BountyProposed
  | types.pallet_bounties.pallet.Event.BountyRejected
  | types.pallet_bounties.pallet.Event.BountyBecameActive
  | types.pallet_bounties.pallet.Event.BountyAwarded
  | types.pallet_bounties.pallet.Event.BountyClaimed
  | types.pallet_bounties.pallet.Event.BountyCanceled
  | types.pallet_bounties.pallet.Event.BountyExtended
export namespace Event {
  /** New bounty proposal. */
  export interface BountyProposed {
    type: "BountyProposed"
    index: types.u32
  }
  /** A bounty proposal was rejected; funds were slashed. */
  export interface BountyRejected {
    type: "BountyRejected"
    index: types.u32
    bond: types.u128
  }
  /** A bounty proposal is funded and became active. */
  export interface BountyBecameActive {
    type: "BountyBecameActive"
    index: types.u32
  }
  /** A bounty is awarded to a beneficiary. */
  export interface BountyAwarded {
    type: "BountyAwarded"
    index: types.u32
    beneficiary: types.sp_core.crypto.AccountId32
  }
  /** A bounty is claimed by beneficiary. */
  export interface BountyClaimed {
    type: "BountyClaimed"
    index: types.u32
    payout: types.u128
    beneficiary: types.sp_core.crypto.AccountId32
  }
  /** A bounty is cancelled. */
  export interface BountyCanceled {
    type: "BountyCanceled"
    index: types.u32
  }
  /** A bounty expiry is extended. */
  export interface BountyExtended {
    type: "BountyExtended"
    index: types.u32
  }
  /** New bounty proposal. */
  export function BountyProposed(
    value: Omit<types.pallet_bounties.pallet.Event.BountyProposed, "type">,
  ): types.pallet_bounties.pallet.Event.BountyProposed {
    return { type: "BountyProposed", ...value }
  }
  /** A bounty proposal was rejected; funds were slashed. */
  export function BountyRejected(
    value: Omit<types.pallet_bounties.pallet.Event.BountyRejected, "type">,
  ): types.pallet_bounties.pallet.Event.BountyRejected {
    return { type: "BountyRejected", ...value }
  }
  /** A bounty proposal is funded and became active. */
  export function BountyBecameActive(
    value: Omit<types.pallet_bounties.pallet.Event.BountyBecameActive, "type">,
  ): types.pallet_bounties.pallet.Event.BountyBecameActive {
    return { type: "BountyBecameActive", ...value }
  }
  /** A bounty is awarded to a beneficiary. */
  export function BountyAwarded(
    value: Omit<types.pallet_bounties.pallet.Event.BountyAwarded, "type">,
  ): types.pallet_bounties.pallet.Event.BountyAwarded {
    return { type: "BountyAwarded", ...value }
  }
  /** A bounty is claimed by beneficiary. */
  export function BountyClaimed(
    value: Omit<types.pallet_bounties.pallet.Event.BountyClaimed, "type">,
  ): types.pallet_bounties.pallet.Event.BountyClaimed {
    return { type: "BountyClaimed", ...value }
  }
  /** A bounty is cancelled. */
  export function BountyCanceled(
    value: Omit<types.pallet_bounties.pallet.Event.BountyCanceled, "type">,
  ): types.pallet_bounties.pallet.Event.BountyCanceled {
    return { type: "BountyCanceled", ...value }
  }
  /** A bounty expiry is extended. */
  export function BountyExtended(
    value: Omit<types.pallet_bounties.pallet.Event.BountyExtended, "type">,
  ): types.pallet_bounties.pallet.Event.BountyExtended {
    return { type: "BountyExtended", ...value }
  }
}
