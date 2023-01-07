import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_treasury.pallet.Call> = codecs.$243
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_treasury.pallet.Call.proposeSpend
  | types.pallet_treasury.pallet.Call.rejectProposal
  | types.pallet_treasury.pallet.Call.approveProposal
  | types.pallet_treasury.pallet.Call.spend
  | types.pallet_treasury.pallet.Call.removeApproval
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
  export interface proposeSpend {
    type: "proposeSpend"
    value: types.Compact<types.u128>
    beneficiary: types.sp_runtime.multiaddress.MultiAddress
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
  export interface rejectProposal {
    type: "rejectProposal"
    proposalId: types.Compact<types.u32>
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
  export interface approveProposal {
    type: "approveProposal"
    proposalId: types.Compact<types.u32>
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
    amount: types.Compact<types.u128>
    beneficiary: types.sp_runtime.multiaddress.MultiAddress
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
  export interface removeApproval {
    type: "removeApproval"
    proposalId: types.Compact<types.u32>
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
  export function proposeSpend(
    value: Omit<types.pallet_treasury.pallet.Call.proposeSpend, "type">,
  ): types.pallet_treasury.pallet.Call.proposeSpend {
    return { type: "proposeSpend", ...value }
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
  ): types.pallet_treasury.pallet.Call.rejectProposal {
    return { type: "rejectProposal", ...value }
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
  ): types.pallet_treasury.pallet.Call.approveProposal {
    return { type: "approveProposal", ...value }
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
  ): types.pallet_treasury.pallet.Call.spend {
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
  export function removeApproval(
    value: Omit<types.pallet_treasury.pallet.Call.removeApproval, "type">,
  ): types.pallet_treasury.pallet.Call.removeApproval {
    return { type: "removeApproval", ...value }
  }
}

export const $error: $.Codec<types.pallet_treasury.pallet.Error> = codecs.$556
/** Error for the treasury pallet. */

export type Error =
  | "InsufficientProposersBalance"
  | "InvalidIndex"
  | "TooManyApprovals"
  | "InsufficientPermission"
  | "ProposalNotApproved"

export const $event: $.Codec<types.pallet_treasury.pallet.Event> = codecs.$72
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_treasury.pallet.Event.Proposed
  | types.pallet_treasury.pallet.Event.Spending
  | types.pallet_treasury.pallet.Event.Awarded
  | types.pallet_treasury.pallet.Event.Rejected
  | types.pallet_treasury.pallet.Event.Burnt
  | types.pallet_treasury.pallet.Event.Rollover
  | types.pallet_treasury.pallet.Event.Deposit
  | types.pallet_treasury.pallet.Event.SpendApproved
export namespace Event {
  /** New proposal. */
  export interface Proposed {
    type: "Proposed"
    proposalIndex: types.u32
  }
  /** We have ended a spend period and will now allocate funds. */
  export interface Spending {
    type: "Spending"
    budgetRemaining: types.u128
  }
  /** Some funds have been allocated. */
  export interface Awarded {
    type: "Awarded"
    proposalIndex: types.u32
    award: types.u128
    account: types.sp_core.crypto.AccountId32
  }
  /** A proposal was rejected; funds were slashed. */
  export interface Rejected {
    type: "Rejected"
    proposalIndex: types.u32
    slashed: types.u128
  }
  /** Some of our funds have been burnt. */
  export interface Burnt {
    type: "Burnt"
    burntFunds: types.u128
  }
  /** Spending has finished; this is the amount that rolls over until next spend. */
  export interface Rollover {
    type: "Rollover"
    rolloverBalance: types.u128
  }
  /** Some funds have been deposited. */
  export interface Deposit {
    type: "Deposit"
    value: types.u128
  }
  /** A new spend proposal has been approved. */
  export interface SpendApproved {
    type: "SpendApproved"
    proposalIndex: types.u32
    amount: types.u128
    beneficiary: types.sp_core.crypto.AccountId32
  }
  /** New proposal. */
  export function Proposed(
    value: Omit<types.pallet_treasury.pallet.Event.Proposed, "type">,
  ): types.pallet_treasury.pallet.Event.Proposed {
    return { type: "Proposed", ...value }
  }
  /** We have ended a spend period and will now allocate funds. */
  export function Spending(
    value: Omit<types.pallet_treasury.pallet.Event.Spending, "type">,
  ): types.pallet_treasury.pallet.Event.Spending {
    return { type: "Spending", ...value }
  }
  /** Some funds have been allocated. */
  export function Awarded(
    value: Omit<types.pallet_treasury.pallet.Event.Awarded, "type">,
  ): types.pallet_treasury.pallet.Event.Awarded {
    return { type: "Awarded", ...value }
  }
  /** A proposal was rejected; funds were slashed. */
  export function Rejected(
    value: Omit<types.pallet_treasury.pallet.Event.Rejected, "type">,
  ): types.pallet_treasury.pallet.Event.Rejected {
    return { type: "Rejected", ...value }
  }
  /** Some of our funds have been burnt. */
  export function Burnt(
    value: Omit<types.pallet_treasury.pallet.Event.Burnt, "type">,
  ): types.pallet_treasury.pallet.Event.Burnt {
    return { type: "Burnt", ...value }
  }
  /** Spending has finished; this is the amount that rolls over until next spend. */
  export function Rollover(
    value: Omit<types.pallet_treasury.pallet.Event.Rollover, "type">,
  ): types.pallet_treasury.pallet.Event.Rollover {
    return { type: "Rollover", ...value }
  }
  /** Some funds have been deposited. */
  export function Deposit(
    value: Omit<types.pallet_treasury.pallet.Event.Deposit, "type">,
  ): types.pallet_treasury.pallet.Event.Deposit {
    return { type: "Deposit", ...value }
  }
  /** A new spend proposal has been approved. */
  export function SpendApproved(
    value: Omit<types.pallet_treasury.pallet.Event.SpendApproved, "type">,
  ): types.pallet_treasury.pallet.Event.SpendApproved {
    return { type: "SpendApproved", ...value }
  }
}
