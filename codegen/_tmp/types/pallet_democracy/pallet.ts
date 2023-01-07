import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_democracy.pallet.Call> = codecs.$234
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_democracy.pallet.Call.propose
  | types.pallet_democracy.pallet.Call.second
  | types.pallet_democracy.pallet.Call.vote
  | types.pallet_democracy.pallet.Call.emergencyCancel
  | types.pallet_democracy.pallet.Call.externalPropose
  | types.pallet_democracy.pallet.Call.externalProposeMajority
  | types.pallet_democracy.pallet.Call.externalProposeDefault
  | types.pallet_democracy.pallet.Call.fastTrack
  | types.pallet_democracy.pallet.Call.vetoExternal
  | types.pallet_democracy.pallet.Call.cancelReferendum
  | types.pallet_democracy.pallet.Call.cancelQueued
  | types.pallet_democracy.pallet.Call.delegate
  | types.pallet_democracy.pallet.Call.undelegate
  | types.pallet_democracy.pallet.Call.clearPublicProposals
  | types.pallet_democracy.pallet.Call.notePreimage
  | types.pallet_democracy.pallet.Call.notePreimageOperational
  | types.pallet_democracy.pallet.Call.noteImminentPreimage
  | types.pallet_democracy.pallet.Call.noteImminentPreimageOperational
  | types.pallet_democracy.pallet.Call.reapPreimage
  | types.pallet_democracy.pallet.Call.unlock
  | types.pallet_democracy.pallet.Call.removeVote
  | types.pallet_democracy.pallet.Call.removeOtherVote
  | types.pallet_democracy.pallet.Call.enactProposal
  | types.pallet_democracy.pallet.Call.blacklist
  | types.pallet_democracy.pallet.Call.cancelProposal
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
   *
   * Weight: `O(p)`
   */
  export interface propose {
    type: "propose"
    proposalHash: types.primitive_types.H256
    value: types.Compact<types.u128>
  }
  /**
   * Signals agreement with a particular proposal.
   *
   * The dispatch origin of this call must be _Signed_ and the sender
   * must have funds to cover the deposit, equal to the original deposit.
   *
   * - `proposal`: The index of the proposal to second.
   * - `seconds_upper_bound`: an upper bound on the current number of seconds on this
   *   proposal. Extrinsic is weighted according to this value with no refund.
   *
   * Weight: `O(S)` where S is the number of seconds a proposal already has.
   */
  export interface second {
    type: "second"
    proposal: types.Compact<types.u32>
    secondsUpperBound: types.Compact<types.u32>
  }
  /**
   * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the proposal;
   * otherwise it is a vote to keep the status quo.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `ref_index`: The index of the referendum to vote for.
   * - `vote`: The vote configuration.
   *
   * Weight: `O(R)` where R is the number of referendums the voter has voted on.
   */
  export interface vote {
    type: "vote"
    refIndex: types.Compact<types.u32>
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
  export interface emergencyCancel {
    type: "emergencyCancel"
    refIndex: types.u32
  }
  /**
   * Schedule a referendum to be tabled once it is legal to schedule an external
   * referendum.
   *
   * The dispatch origin of this call must be `ExternalOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Weight: `O(V)` with V number of vetoers in the blacklist of proposal.
   *   Decoding vec of length V. Charged as maximum
   */
  export interface externalPropose {
    type: "externalPropose"
    proposalHash: types.primitive_types.H256
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
  export interface externalProposeMajority {
    type: "externalProposeMajority"
    proposalHash: types.primitive_types.H256
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
  export interface externalProposeDefault {
    type: "externalProposeDefault"
    proposalHash: types.primitive_types.H256
  }
  /**
   * Schedule the currently externally-proposed majority-carries referendum to be tabled
   * immediately. If there is no externally-proposed referendum currently, or if there is one
   * but it is not a majority-carries referendum then it fails.
   *
   * The dispatch of this call must be `FastTrackOrigin`.
   *
   * - `proposal_hash`: The hash of the current external proposal.
   * - `voting_period`: The period that is allowed for voting on this proposal.
   * 	Must be always greater than zero.
   * 	For `FastTrackOrigin` must be equal or greater than `FastTrackVotingPeriod`.
   * - `delay`: The number of block after voting has ended in approval and this should be
   *   enacted. This doesn't have a minimum amount.
   *
   * Emits `Started`.
   *
   * Weight: `O(1)`
   */
  export interface fastTrack {
    type: "fastTrack"
    proposalHash: types.primitive_types.H256
    votingPeriod: types.u32
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
  export interface vetoExternal {
    type: "vetoExternal"
    proposalHash: types.primitive_types.H256
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
  export interface cancelReferendum {
    type: "cancelReferendum"
    refIndex: types.Compact<types.u32>
  }
  /**
   * Cancel a proposal queued for enactment.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * - `which`: The index of the referendum to cancel.
   *
   * Weight: `O(D)` where `D` is the items in the dispatch queue. Weighted as `D = 10`.
   */
  export interface cancelQueued {
    type: "cancelQueued"
    which: types.u32
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
  export interface clearPublicProposals {
    type: "clearPublicProposals"
  }
  /**
   * Register the preimage for an upcoming proposal. This doesn't require the proposal to be
   * in the dispatch queue but does require a deposit, returned once enacted.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `encoded_proposal`: The preimage of a proposal.
   *
   * Emits `PreimageNoted`.
   *
   * Weight: `O(E)` with E size of `encoded_proposal` (protected by a required deposit).
   */
  export interface notePreimage {
    type: "notePreimage"
    encodedProposal: Uint8Array
  }
  /** Same as `note_preimage` but origin is `OperationalPreimageOrigin`. */
  export interface notePreimageOperational {
    type: "notePreimageOperational"
    encodedProposal: Uint8Array
  }
  /**
   * Register the preimage for an upcoming proposal. This requires the proposal to be
   * in the dispatch queue. No deposit is needed. When this call is successful, i.e.
   * the preimage has not been uploaded before and matches some imminent proposal,
   * no fee is paid.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `encoded_proposal`: The preimage of a proposal.
   *
   * Emits `PreimageNoted`.
   *
   * Weight: `O(E)` with E size of `encoded_proposal` (protected by a required deposit).
   */
  export interface noteImminentPreimage {
    type: "noteImminentPreimage"
    encodedProposal: Uint8Array
  }
  /** Same as `note_imminent_preimage` but origin is `OperationalPreimageOrigin`. */
  export interface noteImminentPreimageOperational {
    type: "noteImminentPreimageOperational"
    encodedProposal: Uint8Array
  }
  /**
   * Remove an expired proposal preimage and collect the deposit.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `proposal_hash`: The preimage hash of a proposal.
   * - `proposal_length_upper_bound`: an upper bound on length of the proposal. Extrinsic is
   *   weighted according to this value with no refund.
   *
   * This will only work after `VotingPeriod` blocks from the time that the preimage was
   * noted, if it's the same account doing it. If it's a different account, then it'll only
   * work an additional `EnactmentPeriod` later.
   *
   * Emits `PreimageReaped`.
   *
   * Weight: `O(D)` where D is length of proposal.
   */
  export interface reapPreimage {
    type: "reapPreimage"
    proposalHash: types.primitive_types.H256
    proposalLenUpperBound: types.Compact<types.u32>
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
  export interface removeVote {
    type: "removeVote"
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
  export interface removeOtherVote {
    type: "removeOtherVote"
    target: types.sp_runtime.multiaddress.MultiAddress
    index: types.u32
  }
  /** Enact a proposal from a referendum. For now we just make the weight be the maximum. */
  export interface enactProposal {
    type: "enactProposal"
    proposalHash: types.primitive_types.H256
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
    proposalHash: types.primitive_types.H256
    maybeRefIndex: types.u32 | undefined
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
  export interface cancelProposal {
    type: "cancelProposal"
    propIndex: types.Compact<types.u32>
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
   *
   * Weight: `O(p)`
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
   * - `seconds_upper_bound`: an upper bound on the current number of seconds on this
   *   proposal. Extrinsic is weighted according to this value with no refund.
   *
   * Weight: `O(S)` where S is the number of seconds a proposal already has.
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
   *
   * Weight: `O(R)` where R is the number of referendums the voter has voted on.
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
  export function emergencyCancel(
    value: Omit<types.pallet_democracy.pallet.Call.emergencyCancel, "type">,
  ): types.pallet_democracy.pallet.Call.emergencyCancel {
    return { type: "emergencyCancel", ...value }
  }
  /**
   * Schedule a referendum to be tabled once it is legal to schedule an external
   * referendum.
   *
   * The dispatch origin of this call must be `ExternalOrigin`.
   *
   * - `proposal_hash`: The preimage hash of the proposal.
   *
   * Weight: `O(V)` with V number of vetoers in the blacklist of proposal.
   *   Decoding vec of length V. Charged as maximum
   */
  export function externalPropose(
    value: Omit<types.pallet_democracy.pallet.Call.externalPropose, "type">,
  ): types.pallet_democracy.pallet.Call.externalPropose {
    return { type: "externalPropose", ...value }
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
  export function externalProposeMajority(
    value: Omit<types.pallet_democracy.pallet.Call.externalProposeMajority, "type">,
  ): types.pallet_democracy.pallet.Call.externalProposeMajority {
    return { type: "externalProposeMajority", ...value }
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
  export function externalProposeDefault(
    value: Omit<types.pallet_democracy.pallet.Call.externalProposeDefault, "type">,
  ): types.pallet_democracy.pallet.Call.externalProposeDefault {
    return { type: "externalProposeDefault", ...value }
  }
  /**
   * Schedule the currently externally-proposed majority-carries referendum to be tabled
   * immediately. If there is no externally-proposed referendum currently, or if there is one
   * but it is not a majority-carries referendum then it fails.
   *
   * The dispatch of this call must be `FastTrackOrigin`.
   *
   * - `proposal_hash`: The hash of the current external proposal.
   * - `voting_period`: The period that is allowed for voting on this proposal.
   * 	Must be always greater than zero.
   * 	For `FastTrackOrigin` must be equal or greater than `FastTrackVotingPeriod`.
   * - `delay`: The number of block after voting has ended in approval and this should be
   *   enacted. This doesn't have a minimum amount.
   *
   * Emits `Started`.
   *
   * Weight: `O(1)`
   */
  export function fastTrack(
    value: Omit<types.pallet_democracy.pallet.Call.fastTrack, "type">,
  ): types.pallet_democracy.pallet.Call.fastTrack {
    return { type: "fastTrack", ...value }
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
  export function vetoExternal(
    value: Omit<types.pallet_democracy.pallet.Call.vetoExternal, "type">,
  ): types.pallet_democracy.pallet.Call.vetoExternal {
    return { type: "vetoExternal", ...value }
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
  export function cancelReferendum(
    value: Omit<types.pallet_democracy.pallet.Call.cancelReferendum, "type">,
  ): types.pallet_democracy.pallet.Call.cancelReferendum {
    return { type: "cancelReferendum", ...value }
  }
  /**
   * Cancel a proposal queued for enactment.
   *
   * The dispatch origin of this call must be _Root_.
   *
   * - `which`: The index of the referendum to cancel.
   *
   * Weight: `O(D)` where `D` is the items in the dispatch queue. Weighted as `D = 10`.
   */
  export function cancelQueued(
    value: Omit<types.pallet_democracy.pallet.Call.cancelQueued, "type">,
  ): types.pallet_democracy.pallet.Call.cancelQueued {
    return { type: "cancelQueued", ...value }
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
  export function clearPublicProposals(): types.pallet_democracy.pallet.Call.clearPublicProposals {
    return { type: "clearPublicProposals" }
  }
  /**
   * Register the preimage for an upcoming proposal. This doesn't require the proposal to be
   * in the dispatch queue but does require a deposit, returned once enacted.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `encoded_proposal`: The preimage of a proposal.
   *
   * Emits `PreimageNoted`.
   *
   * Weight: `O(E)` with E size of `encoded_proposal` (protected by a required deposit).
   */
  export function notePreimage(
    value: Omit<types.pallet_democracy.pallet.Call.notePreimage, "type">,
  ): types.pallet_democracy.pallet.Call.notePreimage {
    return { type: "notePreimage", ...value }
  }
  /** Same as `note_preimage` but origin is `OperationalPreimageOrigin`. */
  export function notePreimageOperational(
    value: Omit<types.pallet_democracy.pallet.Call.notePreimageOperational, "type">,
  ): types.pallet_democracy.pallet.Call.notePreimageOperational {
    return { type: "notePreimageOperational", ...value }
  }
  /**
   * Register the preimage for an upcoming proposal. This requires the proposal to be
   * in the dispatch queue. No deposit is needed. When this call is successful, i.e.
   * the preimage has not been uploaded before and matches some imminent proposal,
   * no fee is paid.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `encoded_proposal`: The preimage of a proposal.
   *
   * Emits `PreimageNoted`.
   *
   * Weight: `O(E)` with E size of `encoded_proposal` (protected by a required deposit).
   */
  export function noteImminentPreimage(
    value: Omit<types.pallet_democracy.pallet.Call.noteImminentPreimage, "type">,
  ): types.pallet_democracy.pallet.Call.noteImminentPreimage {
    return { type: "noteImminentPreimage", ...value }
  }
  /** Same as `note_imminent_preimage` but origin is `OperationalPreimageOrigin`. */
  export function noteImminentPreimageOperational(
    value: Omit<types.pallet_democracy.pallet.Call.noteImminentPreimageOperational, "type">,
  ): types.pallet_democracy.pallet.Call.noteImminentPreimageOperational {
    return { type: "noteImminentPreimageOperational", ...value }
  }
  /**
   * Remove an expired proposal preimage and collect the deposit.
   *
   * The dispatch origin of this call must be _Signed_.
   *
   * - `proposal_hash`: The preimage hash of a proposal.
   * - `proposal_length_upper_bound`: an upper bound on length of the proposal. Extrinsic is
   *   weighted according to this value with no refund.
   *
   * This will only work after `VotingPeriod` blocks from the time that the preimage was
   * noted, if it's the same account doing it. If it's a different account, then it'll only
   * work an additional `EnactmentPeriod` later.
   *
   * Emits `PreimageReaped`.
   *
   * Weight: `O(D)` where D is length of proposal.
   */
  export function reapPreimage(
    value: Omit<types.pallet_democracy.pallet.Call.reapPreimage, "type">,
  ): types.pallet_democracy.pallet.Call.reapPreimage {
    return { type: "reapPreimage", ...value }
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
  export function removeVote(
    value: Omit<types.pallet_democracy.pallet.Call.removeVote, "type">,
  ): types.pallet_democracy.pallet.Call.removeVote {
    return { type: "removeVote", ...value }
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
  export function removeOtherVote(
    value: Omit<types.pallet_democracy.pallet.Call.removeOtherVote, "type">,
  ): types.pallet_democracy.pallet.Call.removeOtherVote {
    return { type: "removeOtherVote", ...value }
  }
  /** Enact a proposal from a referendum. For now we just make the weight be the maximum. */
  export function enactProposal(
    value: Omit<types.pallet_democracy.pallet.Call.enactProposal, "type">,
  ): types.pallet_democracy.pallet.Call.enactProposal {
    return { type: "enactProposal", ...value }
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
  export function cancelProposal(
    value: Omit<types.pallet_democracy.pallet.Call.cancelProposal, "type">,
  ): types.pallet_democracy.pallet.Call.cancelProposal {
    return { type: "cancelProposal", ...value }
  }
}

export const $error: $.Codec<types.pallet_democracy.pallet.Error> = codecs.$539
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
  | "DuplicatePreimage"
  | "NotImminent"
  | "TooEarly"
  | "Imminent"
  | "PreimageMissing"
  | "ReferendumInvalid"
  | "PreimageInvalid"
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
  | "TooManyProposals"
  | "VotingPeriodLow"

export const $event: $.Codec<types.pallet_democracy.pallet.Event> = codecs.$61
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_democracy.pallet.Event.Proposed
  | types.pallet_democracy.pallet.Event.Tabled
  | types.pallet_democracy.pallet.Event.ExternalTabled
  | types.pallet_democracy.pallet.Event.Started
  | types.pallet_democracy.pallet.Event.Passed
  | types.pallet_democracy.pallet.Event.NotPassed
  | types.pallet_democracy.pallet.Event.Cancelled
  | types.pallet_democracy.pallet.Event.Executed
  | types.pallet_democracy.pallet.Event.Delegated
  | types.pallet_democracy.pallet.Event.Undelegated
  | types.pallet_democracy.pallet.Event.Vetoed
  | types.pallet_democracy.pallet.Event.PreimageNoted
  | types.pallet_democracy.pallet.Event.PreimageUsed
  | types.pallet_democracy.pallet.Event.PreimageInvalid
  | types.pallet_democracy.pallet.Event.PreimageMissing
  | types.pallet_democracy.pallet.Event.PreimageReaped
  | types.pallet_democracy.pallet.Event.Blacklisted
  | types.pallet_democracy.pallet.Event.Voted
  | types.pallet_democracy.pallet.Event.Seconded
  | types.pallet_democracy.pallet.Event.ProposalCanceled
export namespace Event {
  /** A motion has been proposed by a public account. */
  export interface Proposed {
    type: "Proposed"
    proposalIndex: types.u32
    deposit: types.u128
  }
  /** A public proposal has been tabled for referendum vote. */
  export interface Tabled {
    type: "Tabled"
    proposalIndex: types.u32
    deposit: types.u128
    depositors: Array<types.sp_core.crypto.AccountId32>
  }
  /** An external proposal has been tabled. */
  export interface ExternalTabled {
    type: "ExternalTabled"
  }
  /** A referendum has begun. */
  export interface Started {
    type: "Started"
    refIndex: types.u32
    threshold: types.pallet_democracy.vote_threshold.VoteThreshold
  }
  /** A proposal has been approved by referendum. */
  export interface Passed {
    type: "Passed"
    refIndex: types.u32
  }
  /** A proposal has been rejected by referendum. */
  export interface NotPassed {
    type: "NotPassed"
    refIndex: types.u32
  }
  /** A referendum has been cancelled. */
  export interface Cancelled {
    type: "Cancelled"
    refIndex: types.u32
  }
  /** A proposal has been enacted. */
  export interface Executed {
    type: "Executed"
    refIndex: types.u32
    result: null | C.ChainError<types.sp_runtime.DispatchError>
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
    proposalHash: types.primitive_types.H256
    until: types.u32
  }
  /** A proposal's preimage was noted, and the deposit taken. */
  export interface PreimageNoted {
    type: "PreimageNoted"
    proposalHash: types.primitive_types.H256
    who: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A proposal preimage was removed and used (the deposit was returned). */
  export interface PreimageUsed {
    type: "PreimageUsed"
    proposalHash: types.primitive_types.H256
    provider: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A proposal could not be executed because its preimage was invalid. */
  export interface PreimageInvalid {
    type: "PreimageInvalid"
    proposalHash: types.primitive_types.H256
    refIndex: types.u32
  }
  /** A proposal could not be executed because its preimage was missing. */
  export interface PreimageMissing {
    type: "PreimageMissing"
    proposalHash: types.primitive_types.H256
    refIndex: types.u32
  }
  /** A registered preimage was removed and the deposit collected by the reaper. */
  export interface PreimageReaped {
    type: "PreimageReaped"
    proposalHash: types.primitive_types.H256
    provider: types.sp_core.crypto.AccountId32
    deposit: types.u128
    reaper: types.sp_core.crypto.AccountId32
  }
  /** A proposal_hash has been blacklisted permanently. */
  export interface Blacklisted {
    type: "Blacklisted"
    proposalHash: types.primitive_types.H256
  }
  /** An account has voted in a referendum */
  export interface Voted {
    type: "Voted"
    voter: types.sp_core.crypto.AccountId32
    refIndex: types.u32
    vote: types.pallet_democracy.vote.AccountVote
  }
  /** An account has secconded a proposal */
  export interface Seconded {
    type: "Seconded"
    seconder: types.sp_core.crypto.AccountId32
    propIndex: types.u32
  }
  /** A proposal got canceled. */
  export interface ProposalCanceled {
    type: "ProposalCanceled"
    propIndex: types.u32
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
  /** A proposal has been enacted. */
  export function Executed(
    value: Omit<types.pallet_democracy.pallet.Event.Executed, "type">,
  ): types.pallet_democracy.pallet.Event.Executed {
    return { type: "Executed", ...value }
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
  /** A proposal's preimage was noted, and the deposit taken. */
  export function PreimageNoted(
    value: Omit<types.pallet_democracy.pallet.Event.PreimageNoted, "type">,
  ): types.pallet_democracy.pallet.Event.PreimageNoted {
    return { type: "PreimageNoted", ...value }
  }
  /** A proposal preimage was removed and used (the deposit was returned). */
  export function PreimageUsed(
    value: Omit<types.pallet_democracy.pallet.Event.PreimageUsed, "type">,
  ): types.pallet_democracy.pallet.Event.PreimageUsed {
    return { type: "PreimageUsed", ...value }
  }
  /** A proposal could not be executed because its preimage was invalid. */
  export function PreimageInvalid(
    value: Omit<types.pallet_democracy.pallet.Event.PreimageInvalid, "type">,
  ): types.pallet_democracy.pallet.Event.PreimageInvalid {
    return { type: "PreimageInvalid", ...value }
  }
  /** A proposal could not be executed because its preimage was missing. */
  export function PreimageMissing(
    value: Omit<types.pallet_democracy.pallet.Event.PreimageMissing, "type">,
  ): types.pallet_democracy.pallet.Event.PreimageMissing {
    return { type: "PreimageMissing", ...value }
  }
  /** A registered preimage was removed and the deposit collected by the reaper. */
  export function PreimageReaped(
    value: Omit<types.pallet_democracy.pallet.Event.PreimageReaped, "type">,
  ): types.pallet_democracy.pallet.Event.PreimageReaped {
    return { type: "PreimageReaped", ...value }
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
