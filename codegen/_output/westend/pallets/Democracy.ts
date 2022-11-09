import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  A record of who vetoed what. Maps proposal hash to a possible existent block number
 *  (until when it may not be resubmitted) and who vetoed it.
 */
export const Blacklist = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$543,
}

/** Record of all proposals that have been subject to emergency cancellation. */
export const Cancellations = {
  type: "Map",
  modifier: "Default",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$43,
}

/**
 *  Those who have locked a deposit.
 *
 *  TWOX-NOTE: Safe, as increasing integer keys are safe.
 */
export const DepositOf = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$531,
}

/**
 *  True if the last referendum tabled was submitted externally. False if it was a public
 *  proposal.
 */
export const LastTabledWasExternal = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$43,
}

/**
 *  The lowest referendum index representing an unbaked referendum. Equal to
 *  `ReferendumCount` if there isn't a unbaked referendum.
 */
export const LowestUnbaked = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  The referendum to be tabled whenever it would be valid to table an external proposal.
 *  This happens when a referendum needs to be tabled and one of two conditions are met:
 *  - `LastTabledWasExternal` is `false`; or
 *  - `PublicProps` is empty.
 */
export const NextExternal = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$542,
}

/** The number of (public) proposals that have been made so far. */
export const PublicPropCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** The public proposals. Unsorted. The second item is the proposal. */
export const PublicProps = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$528,
}

/** The next free referendum index, aka the number of referenda started so far. */
export const ReferendumCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Information concerning any given referendum.
 *
 *  TWOX-NOTE: SAFE as indexes are not under an attacker’s control.
 */
export const ReferendumInfoOf = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$533,
}

/**
 *  All votes for a particular voter. We store the balance for the number of votes that we
 *  have recorded. The second item is the total amount of delegations, that will be added.
 *
 *  TWOX-NOTE: SAFE as `AccountId`s are crypto hashes anyway.
 */
export const VotingOf = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$536,
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
  value: Omit<t.pallet_democracy.pallet.Call.blacklist, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "blacklist" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.cancel_proposal, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "cancel_proposal" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.cancel_referendum, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "cancel_referendum" } }
}

/**
 * Clears all public proposals.
 *
 * The dispatch origin of this call must be _Root_.
 *
 * Weight: `O(1)`.
 */
export function clear_public_proposals(): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { type: "clear_public_proposals" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.delegate, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "delegate" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.emergency_cancel, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "emergency_cancel" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.external_propose, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "external_propose" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.external_propose_default, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "external_propose_default" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.external_propose_majority, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "external_propose_majority" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.fast_track, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "fast_track" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.propose, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "propose" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.remove_other_vote, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "remove_other_vote" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.remove_vote, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "remove_vote" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.second, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "second" } }
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
export function undelegate(): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { type: "undelegate" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.unlock, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "unlock" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.veto_external, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "veto_external" } }
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
  value: Omit<t.pallet_democracy.pallet.Call.vote, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Democracy", value: { ...value, type: "vote" } }
}
