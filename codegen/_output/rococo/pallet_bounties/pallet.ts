import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_bounties.pallet.Call> = _codec.$307

export const $error: $.Codec<t.pallet_bounties.pallet.Error> = _codec.$594

export const $event: $.Codec<t.pallet_bounties.pallet.Event> = _codec.$83

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_bounties.pallet.Call.propose_bounty
  | t.pallet_bounties.pallet.Call.approve_bounty
  | t.pallet_bounties.pallet.Call.propose_curator
  | t.pallet_bounties.pallet.Call.unassign_curator
  | t.pallet_bounties.pallet.Call.accept_curator
  | t.pallet_bounties.pallet.Call.award_bounty
  | t.pallet_bounties.pallet.Call.claim_bounty
  | t.pallet_bounties.pallet.Call.close_bounty
  | t.pallet_bounties.pallet.Call.extend_bounty_expiry
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
  export interface propose_bounty {
    type: "propose_bounty"
    value: t.Compact<t.u128>
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
  export interface approve_bounty {
    type: "approve_bounty"
    bounty_id: t.Compact<t.u32>
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
  export interface propose_curator {
    type: "propose_curator"
    bounty_id: t.Compact<t.u32>
    curator: t.sp_runtime.multiaddress.MultiAddress
    fee: t.Compact<t.u128>
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
  export interface unassign_curator {
    type: "unassign_curator"
    bounty_id: t.Compact<t.u32>
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
  export interface accept_curator {
    type: "accept_curator"
    bounty_id: t.Compact<t.u32>
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
  export interface award_bounty {
    type: "award_bounty"
    bounty_id: t.Compact<t.u32>
    beneficiary: t.sp_runtime.multiaddress.MultiAddress
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
  export interface claim_bounty {
    type: "claim_bounty"
    bounty_id: t.Compact<t.u32>
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
  export interface close_bounty {
    type: "close_bounty"
    bounty_id: t.Compact<t.u32>
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
  export interface extend_bounty_expiry {
    type: "extend_bounty_expiry"
    bounty_id: t.Compact<t.u32>
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
  export function propose_bounty(
    value: Omit<t.pallet_bounties.pallet.Call.propose_bounty, "type">,
  ): t.pallet_bounties.pallet.Call.propose_bounty {
    return { type: "propose_bounty", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.approve_bounty, "type">,
  ): t.pallet_bounties.pallet.Call.approve_bounty {
    return { type: "approve_bounty", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.propose_curator, "type">,
  ): t.pallet_bounties.pallet.Call.propose_curator {
    return { type: "propose_curator", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.unassign_curator, "type">,
  ): t.pallet_bounties.pallet.Call.unassign_curator {
    return { type: "unassign_curator", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.accept_curator, "type">,
  ): t.pallet_bounties.pallet.Call.accept_curator {
    return { type: "accept_curator", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.award_bounty, "type">,
  ): t.pallet_bounties.pallet.Call.award_bounty {
    return { type: "award_bounty", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.claim_bounty, "type">,
  ): t.pallet_bounties.pallet.Call.claim_bounty {
    return { type: "claim_bounty", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.close_bounty, "type">,
  ): t.pallet_bounties.pallet.Call.close_bounty {
    return { type: "close_bounty", ...value }
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
    value: Omit<t.pallet_bounties.pallet.Call.extend_bounty_expiry, "type">,
  ): t.pallet_bounties.pallet.Call.extend_bounty_expiry {
    return { type: "extend_bounty_expiry", ...value }
  }
}

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

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_bounties.pallet.Event.BountyProposed
  | t.pallet_bounties.pallet.Event.BountyRejected
  | t.pallet_bounties.pallet.Event.BountyBecameActive
  | t.pallet_bounties.pallet.Event.BountyAwarded
  | t.pallet_bounties.pallet.Event.BountyClaimed
  | t.pallet_bounties.pallet.Event.BountyCanceled
  | t.pallet_bounties.pallet.Event.BountyExtended
export namespace Event {
  /** New bounty proposal. */
  export interface BountyProposed {
    type: "BountyProposed"
    index: t.u32
  }
  /** A bounty proposal was rejected; funds were slashed. */
  export interface BountyRejected {
    type: "BountyRejected"
    index: t.u32
    bond: t.u128
  }
  /** A bounty proposal is funded and became active. */
  export interface BountyBecameActive {
    type: "BountyBecameActive"
    index: t.u32
  }
  /** A bounty is awarded to a beneficiary. */
  export interface BountyAwarded {
    type: "BountyAwarded"
    index: t.u32
    beneficiary: t.sp_core.crypto.AccountId32
  }
  /** A bounty is claimed by beneficiary. */
  export interface BountyClaimed {
    type: "BountyClaimed"
    index: t.u32
    payout: t.u128
    beneficiary: t.sp_core.crypto.AccountId32
  }
  /** A bounty is cancelled. */
  export interface BountyCanceled {
    type: "BountyCanceled"
    index: t.u32
  }
  /** A bounty expiry is extended. */
  export interface BountyExtended {
    type: "BountyExtended"
    index: t.u32
  }
  /** New bounty proposal. */
  export function BountyProposed(
    value: Omit<t.pallet_bounties.pallet.Event.BountyProposed, "type">,
  ): t.pallet_bounties.pallet.Event.BountyProposed {
    return { type: "BountyProposed", ...value }
  }
  /** A bounty proposal was rejected; funds were slashed. */
  export function BountyRejected(
    value: Omit<t.pallet_bounties.pallet.Event.BountyRejected, "type">,
  ): t.pallet_bounties.pallet.Event.BountyRejected {
    return { type: "BountyRejected", ...value }
  }
  /** A bounty proposal is funded and became active. */
  export function BountyBecameActive(
    value: Omit<t.pallet_bounties.pallet.Event.BountyBecameActive, "type">,
  ): t.pallet_bounties.pallet.Event.BountyBecameActive {
    return { type: "BountyBecameActive", ...value }
  }
  /** A bounty is awarded to a beneficiary. */
  export function BountyAwarded(
    value: Omit<t.pallet_bounties.pallet.Event.BountyAwarded, "type">,
  ): t.pallet_bounties.pallet.Event.BountyAwarded {
    return { type: "BountyAwarded", ...value }
  }
  /** A bounty is claimed by beneficiary. */
  export function BountyClaimed(
    value: Omit<t.pallet_bounties.pallet.Event.BountyClaimed, "type">,
  ): t.pallet_bounties.pallet.Event.BountyClaimed {
    return { type: "BountyClaimed", ...value }
  }
  /** A bounty is cancelled. */
  export function BountyCanceled(
    value: Omit<t.pallet_bounties.pallet.Event.BountyCanceled, "type">,
  ): t.pallet_bounties.pallet.Event.BountyCanceled {
    return { type: "BountyCanceled", ...value }
  }
  /** A bounty expiry is extended. */
  export function BountyExtended(
    value: Omit<t.pallet_bounties.pallet.Event.BountyExtended, "type">,
  ): t.pallet_bounties.pallet.Event.BountyExtended {
    return { type: "BountyExtended", ...value }
  }
}
