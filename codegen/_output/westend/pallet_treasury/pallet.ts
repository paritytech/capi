import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_treasury.pallet.Call> = _codec.$244

export const $error: $.Codec<t.pallet_treasury.pallet.Error> = _codec.$561

export const $event: $.Codec<t.pallet_treasury.pallet.Event> = _codec.$71

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_treasury.pallet.Call.propose_spend
  | t.pallet_treasury.pallet.Call.reject_proposal
  | t.pallet_treasury.pallet.Call.approve_proposal
  | t.pallet_treasury.pallet.Call.spend
  | t.pallet_treasury.pallet.Call.remove_approval
export namespace Call {
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
  export interface propose_spend {
    type: "propose_spend"
    value: t.Compact<t.u128>
    beneficiary: t.sp_runtime.multiaddress.MultiAddress
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
  export interface reject_proposal {
    type: "reject_proposal"
    proposal_id: t.Compact<t.u32>
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
  export interface approve_proposal {
    type: "approve_proposal"
    proposal_id: t.Compact<t.u32>
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
  export interface spend {
    type: "spend"
    amount: t.Compact<t.u128>
    beneficiary: t.sp_runtime.multiaddress.MultiAddress
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
  export interface remove_approval {
    type: "remove_approval"
    proposal_id: t.Compact<t.u32>
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
  ): t.pallet_treasury.pallet.Call.propose_spend {
    return { type: "propose_spend", ...value }
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
  ): t.pallet_treasury.pallet.Call.reject_proposal {
    return { type: "reject_proposal", ...value }
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
  ): t.pallet_treasury.pallet.Call.approve_proposal {
    return { type: "approve_proposal", ...value }
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
  ): t.pallet_treasury.pallet.Call.spend {
    return { type: "spend", ...value }
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
  ): t.pallet_treasury.pallet.Call.remove_approval {
    return { type: "remove_approval", ...value }
  }
}

/** Error for the treasury pallet. */
export type Error =
  | "InsufficientProposersBalance"
  | "InvalidIndex"
  | "TooManyApprovals"
  | "InsufficientPermission"
  | "ProposalNotApproved"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_treasury.pallet.Event.Proposed
  | t.pallet_treasury.pallet.Event.Spending
  | t.pallet_treasury.pallet.Event.Awarded
  | t.pallet_treasury.pallet.Event.Rejected
  | t.pallet_treasury.pallet.Event.Burnt
  | t.pallet_treasury.pallet.Event.Rollover
  | t.pallet_treasury.pallet.Event.Deposit
  | t.pallet_treasury.pallet.Event.SpendApproved
export namespace Event {
  /** New proposal. */
  export interface Proposed {
    type: "Proposed"
    proposal_index: t.u32
  }
  /** We have ended a spend period and will now allocate funds. */
  export interface Spending {
    type: "Spending"
    budget_remaining: t.u128
  }
  /** Some funds have been allocated. */
  export interface Awarded {
    type: "Awarded"
    proposal_index: t.u32
    award: t.u128
    account: t.sp_core.crypto.AccountId32
  }
  /** A proposal was rejected; funds were slashed. */
  export interface Rejected {
    type: "Rejected"
    proposal_index: t.u32
    slashed: t.u128
  }
  /** Some of our funds have been burnt. */
  export interface Burnt {
    type: "Burnt"
    burnt_funds: t.u128
  }
  /** Spending has finished; this is the amount that rolls over until next spend. */
  export interface Rollover {
    type: "Rollover"
    rollover_balance: t.u128
  }
  /** Some funds have been deposited. */
  export interface Deposit {
    type: "Deposit"
    value: t.u128
  }
  /** A new spend proposal has been approved. */
  export interface SpendApproved {
    type: "SpendApproved"
    proposal_index: t.u32
    amount: t.u128
    beneficiary: t.sp_core.crypto.AccountId32
  }
  /** New proposal. */
  export function Proposed(
    value: Omit<t.pallet_treasury.pallet.Event.Proposed, "type">,
  ): t.pallet_treasury.pallet.Event.Proposed {
    return { type: "Proposed", ...value }
  }
  /** We have ended a spend period and will now allocate funds. */
  export function Spending(
    value: Omit<t.pallet_treasury.pallet.Event.Spending, "type">,
  ): t.pallet_treasury.pallet.Event.Spending {
    return { type: "Spending", ...value }
  }
  /** Some funds have been allocated. */
  export function Awarded(
    value: Omit<t.pallet_treasury.pallet.Event.Awarded, "type">,
  ): t.pallet_treasury.pallet.Event.Awarded {
    return { type: "Awarded", ...value }
  }
  /** A proposal was rejected; funds were slashed. */
  export function Rejected(
    value: Omit<t.pallet_treasury.pallet.Event.Rejected, "type">,
  ): t.pallet_treasury.pallet.Event.Rejected {
    return { type: "Rejected", ...value }
  }
  /** Some of our funds have been burnt. */
  export function Burnt(
    value: Omit<t.pallet_treasury.pallet.Event.Burnt, "type">,
  ): t.pallet_treasury.pallet.Event.Burnt {
    return { type: "Burnt", ...value }
  }
  /** Spending has finished; this is the amount that rolls over until next spend. */
  export function Rollover(
    value: Omit<t.pallet_treasury.pallet.Event.Rollover, "type">,
  ): t.pallet_treasury.pallet.Event.Rollover {
    return { type: "Rollover", ...value }
  }
  /** Some funds have been deposited. */
  export function Deposit(
    value: Omit<t.pallet_treasury.pallet.Event.Deposit, "type">,
  ): t.pallet_treasury.pallet.Event.Deposit {
    return { type: "Deposit", ...value }
  }
  /** A new spend proposal has been approved. */
  export function SpendApproved(
    value: Omit<t.pallet_treasury.pallet.Event.SpendApproved, "type">,
  ): t.pallet_treasury.pallet.Event.SpendApproved {
    return { type: "SpendApproved", ...value }
  }
}
