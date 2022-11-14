import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_democracy.pallet.Call.propose
  | types.pallet_democracy.pallet.Call.second
  | types.pallet_democracy.pallet.Call.vote
  | types.pallet_democracy.pallet.Call.emergency_cancel
  | types.pallet_democracy.pallet.Call.external_propose
  | types.pallet_democracy.pallet.Call.external_propose_majority
  | types.pallet_democracy.pallet.Call.external_propose_default
  | types.pallet_democracy.pallet.Call.fast_track
  | types.pallet_democracy.pallet.Call.veto_external
  | types.pallet_democracy.pallet.Call.cancel_referendum
  | types.pallet_democracy.pallet.Call.delegate
  | types.pallet_democracy.pallet.Call.undelegate
  | types.pallet_democracy.pallet.Call.clear_public_proposals
  | types.pallet_democracy.pallet.Call.unlock
  | types.pallet_democracy.pallet.Call.remove_vote
  | types.pallet_democracy.pallet.Call.remove_other_vote
  | types.pallet_democracy.pallet.Call.blacklist
  | types.pallet_democracy.pallet.Call.cancel_proposal
export namespace Call {
  /**
   * Propose a sensitive action to be taken.
   *
   * The dispatch origin of this call must be _Signed_ and the sender must
   * have funds to cover the deposit.
   *
   * - `proposal_hash`: The hash of the proposal preimage.
   * - `value`: The amount of deposit (must be at least `MinimumDeposit`).
   *
   * Emits `Proposed`.
   */
  export interface propose {
    type: "propose"
    proposal: types.frame_support.traits.preimages.Bounded
    value: types.Compact<types.u128>
  }
  /**
   * Signals agreement with a particular proposal.
   *
   * The dispatch origin of this call must be _Signed_ and the sender
   * must have funds to cover the deposit, equal to the original deposit.
   *
   * - `proposal`: The index of the proposal to second.
   */
  export interface second {
    type: "second"
    proposal: types.Compact<types.u32>
  }
  /**
   * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the proposal;
   * otherwise it is a vote to keep the status quo.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `ref_index`: The index of the referendum to vote for.
   * - `vote`: The vote configuration.
   */
  export interface vote {
    type: "vote"
    ref_index: types.Compact<types.u32>
    vote: types.pallet_democracy.vote.AccountVote
  }
  /**
   * Schedule an emergency cancellation of a referendum. Cannot happen twice to the same
   * referendum.
   *
   * The dispatch origin of this call must be `CancellationOrigin`.
   *
   * -`ref_index`: The index of the referendum to cancel.
   *
   * Weight: `O(1)`.
   */
  export interface emergency_cancel {
    type: "emergency_cancel"
    ref_index: types.u32
  }
  /**
   * Schedule a referendum to be tabled once it is legal to schedule an external
   * referendum.
   *
   * The dispatch origin of this call must be `ExternalOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   */
  export interface external_propose {
    type: "external_propose"
    proposal: types.frame_support.traits.preimages.Bounded
  }
  /**
   * Schedule a majority-carries referendum to be tabled next once it is legal to schedule
   * an external referendum.
   *
   * The dispatch of this call must be `ExternalMajorityOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
   * pre-scheduled `external_propose` call.
   *
   * Weight: `O(1)`
   */
  export interface external_propose_majority {
    type: "external_propose_majority"
    proposal: types.frame_support.traits.preimages.Bounded
  }
  /**
   * Schedule a negative-turnout-bias referendum to be tabled next once it is legal to
   * schedule an external referendum.
   *
   * The dispatch of this call must be `ExternalDefaultOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
   * pre-scheduled `external_propose` call.
   *
   * Weight: `O(1)`
   */
  export interface external_propose_default {
    type: "external_propose_default"
    proposal: types.frame_support.traits.preimages.Bounded
  }
  /**
   * Schedule the currently externally-proposed majority-carries referendum to be tabled
   * immediately. If there is no externally-proposed referendum currently, or if there is one
   * but it is not a majority-carries referendum then it fails.
   *
   * The dispatch of this call must be `FastTrackOrigin`.
   *
   * - `proposal_hash`: The hash of the current external proposal.
   * - `voting_period`: The period that is allowed for voting on this proposal. Increased to
   * 	Must be always greater than zero.
   * 	For `FastTrackOrigin` must be equal or greater than `FastTrackVotingPeriod`.
   * - `delay`: The number of block after voting has ended in approval and this should be
   *   enacted. This doesn't have a minimum amount.
   *
   * Emits `Started`.
   *
   * Weight: `O(1)`
   */
  export interface fast_track {
    type: "fast_track"
    proposal_hash: types.primitive_types.H256
    voting_period: types.u32
    delay: types.u32
  }
  /**
   * Veto and blacklist the external proposal hash.
   *
   * The dispatch origin of this call must be `VetoOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal to veto and blacklist.
   *
   * Emits `Vetoed`.
   *
   * Weight: `O(V + log(V))` where V is number of `existing vetoers`
   */
  export interface veto_external {
    type: "veto_external"
    proposal_hash: types.primitive_types.H256
  }
  /**
   * Remove a referendum.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * - `ref_index`: The index of the referendum to cancel.
   *
   * # Weight: `O(1)`.
   */
  export interface cancel_referendum {
    type: "cancel_referendum"
    ref_index: types.Compact<types.u32>
  }
  /**
   * Delegate the voting power (with some given conviction) of the sending account.
   *
   * The balance delegated is locked for as long as it's delegated, and thereafter for the
   * time appropriate for the conviction's lock period.
   *
   * The dispatch origin of this call must be _Signed_, and the signing account must either:
   *   - be delegating already; or
   *   - have no voting activity (if there is, then it will need to be removed/consolidated
   *     through `reap_vote` or `unvote`).
   *
   * - `to`: The account whose voting the `target` account's voting power will follow.
   * - `conviction`: The conviction that will be attached to the delegated votes. When the
   *   account is undelegated, the funds will be locked for the corresponding period.
   * - `balance`: The amount of the account's balance to be used in delegating. This must not
   *   be more than the account's current balance.
   *
   * Emits `Delegated`.
   *
   * Weight: `O(R)` where R is the number of referendums the voter delegating to has
   *   voted on. Weight is charged as if maximum votes.
   */
  export interface delegate {
    type: "delegate"
    to: types.sp_runtime.multiaddress.MultiAddress
    conviction: types.pallet_democracy.conviction.Conviction
    balance: types.u128
  }
  /**
   * Undelegate the voting power of the sending account.
   *
   * Tokens may be unlocked following once an amount of time consistent with the lock period
   * of the conviction with which the delegation was issued.
   *
   * The dispatch origin of this call must be _Signed_ and the signing account must be
   * currently delegating.
   *
   * Emits `Undelegated`.
   *
   * Weight: `O(R)` where R is the number of referendums the voter delegating to has
   *   voted on. Weight is charged as if maximum votes.
   */
  export interface undelegate {
    type: "undelegate"
  }
  /**
   * Clears all public proposals.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * Weight: `O(1)`.
   */
  export interface clear_public_proposals {
    type: "clear_public_proposals"
  }
  /**
   * Unlock tokens that have an expired lock.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `target`: The account to remove the lock on.
   *
   * Weight: `O(R)` with R number of vote of target.
   */
  export interface unlock {
    type: "unlock"
    target: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove a vote for a referendum.
   *
   * If:
   * - the referendum was cancelled, or
   * - the referendum is ongoing, or
   * - the referendum has ended such that
   *   - the vote of the account was in opposition to the result; or
   *   - there was no conviction to the account's vote; or
   *   - the account made a split vote
   * ...then the vote is removed cleanly and a following call to `unlock` may result in more
   * funds being available.
   *
   * If, however, the referendum has ended and:
   * - it finished corresponding to the vote of the account, and
   * - the account made a standard vote with conviction, and
   * - the lock period of the conviction is not over
   * ...then the lock will be aggregated into the overall account's lock, which may involve
   * *overlocking* (where the two locks are combined into a single lock that is the maximum
   * of both the amount locked and the time is it locked for).
   *
   * The dispatch origin of this call must be _Signed_, and the signer must have a vote
   * registered for referendum `index`.
   *
   * - `index`: The index of referendum of the vote to be removed.
   *
   * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
   *   Weight is calculated for the maximum number of vote.
   */
  export interface remove_vote {
    type: "remove_vote"
    index: types.u32
  }
  /**
   * Remove a vote for a referendum.
   *
   * If the `target` is equal to the signer, then this function is exactly equivalent to
   * `remove_vote`. If not equal to the signer, then the vote must have expired,
   * either because the referendum was cancelled, because the voter lost the referendum or
   * because the conviction period is over.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `target`: The account of the vote to be removed; this account must have voted for
   *   referendum `index`.
   * - `index`: The index of referendum of the vote to be removed.
   *
   * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
   *   Weight is calculated for the maximum number of vote.
   */
  export interface remove_other_vote {
    type: "remove_other_vote"
    target: types.sp_runtime.multiaddress.MultiAddress
    index: types.u32
  }
  /**
   * Permanently place a proposal into the blacklist. This prevents it from ever being
   * proposed again.
   *
   * If called on a queued public or external proposal, then this will result in it being
   * removed. If the `ref_index` supplied is an active referendum with the proposal hash,
   * then it will be cancelled.
   *
   * The dispatch origin of this call must be `BlacklistOrigin`.
   *
   * - `proposal_hash`: The proposal hash to blacklist permanently.
   * - `ref_index`: An ongoing referendum whose hash is `proposal_hash`, which will be
   * cancelled.
   *
   * Weight: `O(p)` (though as this is an high-privilege dispatch, we assume it has a
   *   reasonable value).
   */
  export interface blacklist {
    type: "blacklist"
    proposal_hash: types.primitive_types.H256
    maybe_ref_index: types.u32 | undefined
  }
  /**
   * Remove a proposal.
   *
   * The dispatch origin of this call must be `CancelProposalOrigin`.
   *
   * - `prop_index`: The index of the proposal to cancel.
   *
   * Weight: `O(p)` where `p = PublicProps::<T>::decode_len()`
   */
  export interface cancel_proposal {
    type: "cancel_proposal"
    prop_index: types.Compact<types.u32>
  }
  /**
   * Propose a sensitive action to be taken.
   *
   * The dispatch origin of this call must be _Signed_ and the sender must
   * have funds to cover the deposit.
   *
   * - `proposal_hash`: The hash of the proposal preimage.
   * - `value`: The amount of deposit (must be at least `MinimumDeposit`).
   *
   * Emits `Proposed`.
   */
  export function propose(
    value: Omit<types.pallet_democracy.pallet.Call.propose, "type">,
  ): types.pallet_democracy.pallet.Call.propose {
    return { type: "propose", ...value }
  }
  /**
   * Signals agreement with a particular proposal.
   *
   * The dispatch origin of this call must be _Signed_ and the sender
   * must have funds to cover the deposit, equal to the original deposit.
   *
   * - `proposal`: The index of the proposal to second.
   */
  export function second(
    value: Omit<types.pallet_democracy.pallet.Call.second, "type">,
  ): types.pallet_democracy.pallet.Call.second {
    return { type: "second", ...value }
  }
  /**
   * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the proposal;
   * otherwise it is a vote to keep the status quo.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `ref_index`: The index of the referendum to vote for.
   * - `vote`: The vote configuration.
   */
  export function vote(
    value: Omit<types.pallet_democracy.pallet.Call.vote, "type">,
  ): types.pallet_democracy.pallet.Call.vote {
    return { type: "vote", ...value }
  }
  /**
   * Schedule an emergency cancellation of a referendum. Cannot happen twice to the same
   * referendum.
   *
   * The dispatch origin of this call must be `CancellationOrigin`.
   *
   * -`ref_index`: The index of the referendum to cancel.
   *
   * Weight: `O(1)`.
   */
  export function emergency_cancel(
    value: Omit<types.pallet_democracy.pallet.Call.emergency_cancel, "type">,
  ): types.pallet_democracy.pallet.Call.emergency_cancel {
    return { type: "emergency_cancel", ...value }
  }
  /**
   * Schedule a referendum to be tabled once it is legal to schedule an external
   * referendum.
   *
   * The dispatch origin of this call must be `ExternalOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   */
  export function external_propose(
    value: Omit<types.pallet_democracy.pallet.Call.external_propose, "type">,
  ): types.pallet_democracy.pallet.Call.external_propose {
    return { type: "external_propose", ...value }
  }
  /**
   * Schedule a majority-carries referendum to be tabled next once it is legal to schedule
   * an external referendum.
   *
   * The dispatch of this call must be `ExternalMajorityOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
   * pre-scheduled `external_propose` call.
   *
   * Weight: `O(1)`
   */
  export function external_propose_majority(
    value: Omit<types.pallet_democracy.pallet.Call.external_propose_majority, "type">,
  ): types.pallet_democracy.pallet.Call.external_propose_majority {
    return { type: "external_propose_majority", ...value }
  }
  /**
   * Schedule a negative-turnout-bias referendum to be tabled next once it is legal to
   * schedule an external referendum.
   *
   * The dispatch of this call must be `ExternalDefaultOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
   * pre-scheduled `external_propose` call.
   *
   * Weight: `O(1)`
   */
  export function external_propose_default(
    value: Omit<types.pallet_democracy.pallet.Call.external_propose_default, "type">,
  ): types.pallet_democracy.pallet.Call.external_propose_default {
    return { type: "external_propose_default", ...value }
  }
  /**
   * Schedule the currently externally-proposed majority-carries referendum to be tabled
   * immediately. If there is no externally-proposed referendum currently, or if there is one
   * but it is not a majority-carries referendum then it fails.
   *
   * The dispatch of this call must be `FastTrackOrigin`.
   *
   * - `proposal_hash`: The hash of the current external proposal.
   * - `voting_period`: The period that is allowed for voting on this proposal. Increased to
   * 	Must be always greater than zero.
   * 	For `FastTrackOrigin` must be equal or greater than `FastTrackVotingPeriod`.
   * - `delay`: The number of block after voting has ended in approval and this should be
   *   enacted. This doesn't have a minimum amount.
   *
   * Emits `Started`.
   *
   * Weight: `O(1)`
   */
  export function fast_track(
    value: Omit<types.pallet_democracy.pallet.Call.fast_track, "type">,
  ): types.pallet_democracy.pallet.Call.fast_track {
    return { type: "fast_track", ...value }
  }
  /**
   * Veto and blacklist the external proposal hash.
   *
   * The dispatch origin of this call must be `VetoOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal to veto and blacklist.
   *
   * Emits `Vetoed`.
   *
   * Weight: `O(V + log(V))` where V is number of `existing vetoers`
   */
  export function veto_external(
    value: Omit<types.pallet_democracy.pallet.Call.veto_external, "type">,
  ): types.pallet_democracy.pallet.Call.veto_external {
    return { type: "veto_external", ...value }
  }
  /**
   * Remove a referendum.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * - `ref_index`: The index of the referendum to cancel.
   *
   * # Weight: `O(1)`.
   */
  export function cancel_referendum(
    value: Omit<types.pallet_democracy.pallet.Call.cancel_referendum, "type">,
  ): types.pallet_democracy.pallet.Call.cancel_referendum {
    return { type: "cancel_referendum", ...value }
  }
  /**
   * Delegate the voting power (with some given conviction) of the sending account.
   *
   * The balance delegated is locked for as long as it's delegated, and thereafter for the
   * time appropriate for the conviction's lock period.
   *
   * The dispatch origin of this call must be _Signed_, and the signing account must either:
   *   - be delegating already; or
   *   - have no voting activity (if there is, then it will need to be removed/consolidated
   *     through `reap_vote` or `unvote`).
   *
   * - `to`: The account whose voting the `target` account's voting power will follow.
   * - `conviction`: The conviction that will be attached to the delegated votes. When the
   *   account is undelegated, the funds will be locked for the corresponding period.
   * - `balance`: The amount of the account's balance to be used in delegating. This must not
   *   be more than the account's current balance.
   *
   * Emits `Delegated`.
   *
   * Weight: `O(R)` where R is the number of referendums the voter delegating to has
   *   voted on. Weight is charged as if maximum votes.
   */
  export function delegate(
    value: Omit<types.pallet_democracy.pallet.Call.delegate, "type">,
  ): types.pallet_democracy.pallet.Call.delegate {
    return { type: "delegate", ...value }
  }
  /**
   * Undelegate the voting power of the sending account.
   *
   * Tokens may be unlocked following once an amount of time consistent with the lock period
   * of the conviction with which the delegation was issued.
   *
   * The dispatch origin of this call must be _Signed_ and the signing account must be
   * currently delegating.
   *
   * Emits `Undelegated`.
   *
   * Weight: `O(R)` where R is the number of referendums the voter delegating to has
   *   voted on. Weight is charged as if maximum votes.
   */
  export function undelegate(): types.pallet_democracy.pallet.Call.undelegate {
    return { type: "undelegate" }
  }
  /**
   * Clears all public proposals.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * Weight: `O(1)`.
   */
  export function clear_public_proposals(): types.pallet_democracy.pallet.Call.clear_public_proposals {
    return { type: "clear_public_proposals" }
  }
  /**
   * Unlock tokens that have an expired lock.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `target`: The account to remove the lock on.
   *
   * Weight: `O(R)` with R number of vote of target.
   */
  export function unlock(
    value: Omit<types.pallet_democracy.pallet.Call.unlock, "type">,
  ): types.pallet_democracy.pallet.Call.unlock {
    return { type: "unlock", ...value }
  }
  /**
   * Remove a vote for a referendum.
   *
   * If:
   * - the referendum was cancelled, or
   * - the referendum is ongoing, or
   * - the referendum has ended such that
   *   - the vote of the account was in opposition to the result; or
   *   - there was no conviction to the account's vote; or
   *   - the account made a split vote
   * ...then the vote is removed cleanly and a following call to `unlock` may result in more
   * funds being available.
   *
   * If, however, the referendum has ended and:
   * - it finished corresponding to the vote of the account, and
   * - the account made a standard vote with conviction, and
   * - the lock period of the conviction is not over
   * ...then the lock will be aggregated into the overall account's lock, which may involve
   * *overlocking* (where the two locks are combined into a single lock that is the maximum
   * of both the amount locked and the time is it locked for).
   *
   * The dispatch origin of this call must be _Signed_, and the signer must have a vote
   * registered for referendum `index`.
   *
   * - `index`: The index of referendum of the vote to be removed.
   *
   * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
   *   Weight is calculated for the maximum number of vote.
   */
  export function remove_vote(
    value: Omit<types.pallet_democracy.pallet.Call.remove_vote, "type">,
  ): types.pallet_democracy.pallet.Call.remove_vote {
    return { type: "remove_vote", ...value }
  }
  /**
   * Remove a vote for a referendum.
   *
   * If the `target` is equal to the signer, then this function is exactly equivalent to
   * `remove_vote`. If not equal to the signer, then the vote must have expired,
   * either because the referendum was cancelled, because the voter lost the referendum or
   * because the conviction period is over.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `target`: The account of the vote to be removed; this account must have voted for
   *   referendum `index`.
   * - `index`: The index of referendum of the vote to be removed.
   *
   * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
   *   Weight is calculated for the maximum number of vote.
   */
  export function remove_other_vote(
    value: Omit<types.pallet_democracy.pallet.Call.remove_other_vote, "type">,
  ): types.pallet_democracy.pallet.Call.remove_other_vote {
    return { type: "remove_other_vote", ...value }
  }
  /**
   * Permanently place a proposal into the blacklist. This prevents it from ever being
   * proposed again.
   *
   * If called on a queued public or external proposal, then this will result in it being
   * removed. If the `ref_index` supplied is an active referendum with the proposal hash,
   * then it will be cancelled.
   *
   * The dispatch origin of this call must be `BlacklistOrigin`.
   *
   * - `proposal_hash`: The proposal hash to blacklist permanently.
   * - `ref_index`: An ongoing referendum whose hash is `proposal_hash`, which will be
   * cancelled.
   *
   * Weight: `O(p)` (though as this is an high-privilege dispatch, we assume it has a
   *   reasonable value).
   */
  export function blacklist(
    value: Omit<types.pallet_democracy.pallet.Call.blacklist, "type">,
  ): types.pallet_democracy.pallet.Call.blacklist {
    return { type: "blacklist", ...value }
  }
  /**
   * Remove a proposal.
   *
   * The dispatch origin of this call must be `CancelProposalOrigin`.
   *
   * - `prop_index`: The index of the proposal to cancel.
   *
   * Weight: `O(p)` where `p = PublicProps::<T>::decode_len()`
   */
  export function cancel_proposal(
    value: Omit<types.pallet_democracy.pallet.Call.cancel_proposal, "type">,
  ): types.pallet_democracy.pallet.Call.cancel_proposal {
    return { type: "cancel_proposal", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "ValueLow"
  | "ProposalMissing"
  | "AlreadyCanceled"
  | "DuplicateProposal"
  | "ProposalBlacklisted"
  | "NotSimpleMajority"
  | "InvalidHash"
  | "NoProposal"
  | "AlreadyVetoed"
  | "ReferendumInvalid"
  | "NoneWaiting"
  | "NotVoter"
  | "NoPermission"
  | "AlreadyDelegating"
  | "InsufficientFunds"
  | "NotDelegating"
  | "VotesExist"
  | "InstantNotAllowed"
  | "Nonsense"
  | "WrongUpperBound"
  | "MaxVotesReached"
  | "TooMany"
  | "VotingPeriodLow"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_democracy.pallet.Event.Proposed
  | types.pallet_democracy.pallet.Event.Tabled
  | types.pallet_democracy.pallet.Event.ExternalTabled
  | types.pallet_democracy.pallet.Event.Started
  | types.pallet_democracy.pallet.Event.Passed
  | types.pallet_democracy.pallet.Event.NotPassed
  | types.pallet_democracy.pallet.Event.Cancelled
  | types.pallet_democracy.pallet.Event.Delegated
  | types.pallet_democracy.pallet.Event.Undelegated
  | types.pallet_democracy.pallet.Event.Vetoed
  | types.pallet_democracy.pallet.Event.Blacklisted
  | types.pallet_democracy.pallet.Event.Voted
  | types.pallet_democracy.pallet.Event.Seconded
  | types.pallet_democracy.pallet.Event.ProposalCanceled
export namespace Event {
  /** A motion has been proposed by a public account. */
  export interface Proposed {
    type: "Proposed"
    proposal_index: types.u32
    deposit: types.u128
  }
  /** A public proposal has been tabled for referendum vote. */
  export interface Tabled {
    type: "Tabled"
    proposal_index: types.u32
    deposit: types.u128
  }
  /** An external proposal has been tabled. */
  export interface ExternalTabled {
    type: "ExternalTabled"
  }
  /** A referendum has begun. */
  export interface Started {
    type: "Started"
    ref_index: types.u32
    threshold: types.pallet_democracy.vote_threshold.VoteThreshold
  }
  /** A proposal has been approved by referendum. */
  export interface Passed {
    type: "Passed"
    ref_index: types.u32
  }
  /** A proposal has been rejected by referendum. */
  export interface NotPassed {
    type: "NotPassed"
    ref_index: types.u32
  }
  /** A referendum has been cancelled. */
  export interface Cancelled {
    type: "Cancelled"
    ref_index: types.u32
  }
  /** An account has delegated their vote to another account. */
  export interface Delegated {
    type: "Delegated"
    who: types.sp_core.crypto.AccountId32
    target: types.sp_core.crypto.AccountId32
  }
  /** An account has cancelled a previous delegation operation. */
  export interface Undelegated {
    type: "Undelegated"
    account: types.sp_core.crypto.AccountId32
  }
  /** An external proposal has been vetoed. */
  export interface Vetoed {
    type: "Vetoed"
    who: types.sp_core.crypto.AccountId32
    proposal_hash: types.primitive_types.H256
    until: types.u32
  }
  /** A proposal_hash has been blacklisted permanently. */
  export interface Blacklisted {
    type: "Blacklisted"
    proposal_hash: types.primitive_types.H256
  }
  /** An account has voted in a referendum */
  export interface Voted {
    type: "Voted"
    voter: types.sp_core.crypto.AccountId32
    ref_index: types.u32
    vote: types.pallet_democracy.vote.AccountVote
  }
  /** An account has secconded a proposal */
  export interface Seconded {
    type: "Seconded"
    seconder: types.sp_core.crypto.AccountId32
    prop_index: types.u32
  }
  /** A proposal got canceled. */
  export interface ProposalCanceled {
    type: "ProposalCanceled"
    prop_index: types.u32
  }
  /** A motion has been proposed by a public account. */
  export function Proposed(
    value: Omit<types.pallet_democracy.pallet.Event.Proposed, "type">,
  ): types.pallet_democracy.pallet.Event.Proposed {
    return { type: "Proposed", ...value }
  }
  /** A public proposal has been tabled for referendum vote. */
  export function Tabled(
    value: Omit<types.pallet_democracy.pallet.Event.Tabled, "type">,
  ): types.pallet_democracy.pallet.Event.Tabled {
    return { type: "Tabled", ...value }
  }
  /** An external proposal has been tabled. */
  export function ExternalTabled(): types.pallet_democracy.pallet.Event.ExternalTabled {
    return { type: "ExternalTabled" }
  }
  /** A referendum has begun. */
  export function Started(
    value: Omit<types.pallet_democracy.pallet.Event.Started, "type">,
  ): types.pallet_democracy.pallet.Event.Started {
    return { type: "Started", ...value }
  }
  /** A proposal has been approved by referendum. */
  export function Passed(
    value: Omit<types.pallet_democracy.pallet.Event.Passed, "type">,
  ): types.pallet_democracy.pallet.Event.Passed {
    return { type: "Passed", ...value }
  }
  /** A proposal has been rejected by referendum. */
  export function NotPassed(
    value: Omit<types.pallet_democracy.pallet.Event.NotPassed, "type">,
  ): types.pallet_democracy.pallet.Event.NotPassed {
    return { type: "NotPassed", ...value }
  }
  /** A referendum has been cancelled. */
  export function Cancelled(
    value: Omit<types.pallet_democracy.pallet.Event.Cancelled, "type">,
  ): types.pallet_democracy.pallet.Event.Cancelled {
    return { type: "Cancelled", ...value }
  }
  /** An account has delegated their vote to another account. */
  export function Delegated(
    value: Omit<types.pallet_democracy.pallet.Event.Delegated, "type">,
  ): types.pallet_democracy.pallet.Event.Delegated {
    return { type: "Delegated", ...value }
  }
  /** An account has cancelled a previous delegation operation. */
  export function Undelegated(
    value: Omit<types.pallet_democracy.pallet.Event.Undelegated, "type">,
  ): types.pallet_democracy.pallet.Event.Undelegated {
    return { type: "Undelegated", ...value }
  }
  /** An external proposal has been vetoed. */
  export function Vetoed(
    value: Omit<types.pallet_democracy.pallet.Event.Vetoed, "type">,
  ): types.pallet_democracy.pallet.Event.Vetoed {
    return { type: "Vetoed", ...value }
  }
  /** A proposal_hash has been blacklisted permanently. */
  export function Blacklisted(
    value: Omit<types.pallet_democracy.pallet.Event.Blacklisted, "type">,
  ): types.pallet_democracy.pallet.Event.Blacklisted {
    return { type: "Blacklisted", ...value }
  }
  /** An account has voted in a referendum */
  export function Voted(
    value: Omit<types.pallet_democracy.pallet.Event.Voted, "type">,
  ): types.pallet_democracy.pallet.Event.Voted {
    return { type: "Voted", ...value }
  }
  /** An account has secconded a proposal */
  export function Seconded(
    value: Omit<types.pallet_democracy.pallet.Event.Seconded, "type">,
  ): types.pallet_democracy.pallet.Event.Seconded {
    return { type: "Seconded", ...value }
  }
  /** A proposal got canceled. */
  export function ProposalCanceled(
    value: Omit<types.pallet_democracy.pallet.Event.ProposalCanceled, "type">,
  ): types.pallet_democracy.pallet.Event.ProposalCanceled {
    return { type: "ProposalCanceled", ...value }
  }
}
