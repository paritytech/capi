import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The number of (public) proposals that have been made so far. */
export const PublicPropCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Democracy",
  "PublicPropCount",
  $.tuple(),
  codecs.$4,
)

/** The public proposals. Unsorted. The second item is the proposal's hash. */
export const PublicProps = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Democracy",
  "PublicProps",
  $.tuple(),
  codecs.$524,
)

/**
 *  Those who have locked a deposit.
 *
 *  TWOX-NOTE: Safe, as increasing integer keys are safe.
 */
export const DepositOf = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Democracy",
  "DepositOf",
  $.tuple(codecs.$4),
  codecs.$526,
)

/**
 *  Map of hashes to the proposal preimage, along with who registered it and their deposit.
 *  The block number is the block at which it was deposited.
 */
export const Preimages = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Democracy",
  "Preimages",
  $.tuple(codecs.$10),
  codecs.$527,
)

/** The next free referendum index, aka the number of referenda started so far. */
export const ReferendumCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Democracy",
  "ReferendumCount",
  $.tuple(),
  codecs.$4,
)

/**
 *  The lowest referendum index representing an unbaked referendum. Equal to
 *  `ReferendumCount` if there isn't a unbaked referendum.
 */
export const LowestUnbaked = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Democracy",
  "LowestUnbaked",
  $.tuple(),
  codecs.$4,
)

/**
 *  Information concerning any given referendum.
 *
 *  TWOX-NOTE: SAFE as indexes are not under an attacker’s control.
 */
export const ReferendumInfoOf = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Democracy",
  "ReferendumInfoOf",
  $.tuple(codecs.$4),
  codecs.$528,
)

/**
 *  All votes for a particular voter. We store the balance for the number of votes that we
 *  have recorded. The second item is the total amount of delegations, that will be added.
 *
 *  TWOX-NOTE: SAFE as `AccountId`s are crypto hashes anyway.
 */
export const VotingOf = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Democracy",
  "VotingOf",
  $.tuple(codecs.$0),
  codecs.$531,
)

/**
 *  True if the last referendum tabled was submitted externally. False if it was a public
 *  proposal.
 */
export const LastTabledWasExternal = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Democracy",
  "LastTabledWasExternal",
  $.tuple(),
  codecs.$43,
)

/**
 *  The referendum to be tabled whenever it would be valid to table an external proposal.
 *  This happens when a referendum needs to be tabled and one of two conditions are met:
 *  - `LastTabledWasExternal` is `false`; or
 *  - `PublicProps` is empty.
 */
export const NextExternal = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Democracy",
  "NextExternal",
  $.tuple(),
  codecs.$536,
)

/**
 *  A record of who vetoed what. Maps proposal hash to a possible existent block number
 *  (until when it may not be resubmitted) and who vetoed it.
 */
export const Blacklist = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Democracy",
  "Blacklist",
  $.tuple(codecs.$10),
  codecs.$537,
)

/** Record of all proposals that have been subject to emergency cancellation. */
export const Cancellations = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Democracy",
  "Cancellations",
  $.tuple(codecs.$10),
  codecs.$43,
)

/**
 *  Storage version of the pallet.
 *
 *  New networks start with last version.
 */
export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Democracy",
  "StorageVersion",
  $.tuple(),
  codecs.$538,
)

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
export function propose(value: Omit<types.pallet_democracy.pallet.Call.propose, "type">) {
  return { type: "Democracy", value: { ...value, type: "propose" } }
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
export function second(value: Omit<types.pallet_democracy.pallet.Call.second, "type">) {
  return { type: "Democracy", value: { ...value, type: "second" } }
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
export function vote(value: Omit<types.pallet_democracy.pallet.Call.vote, "type">) {
  return { type: "Democracy", value: { ...value, type: "vote" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "emergencyCancel" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "externalPropose" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "externalProposeMajority" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "externalProposeDefault" } }
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
export function fastTrack(value: Omit<types.pallet_democracy.pallet.Call.fastTrack, "type">) {
  return { type: "Democracy", value: { ...value, type: "fastTrack" } }
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
export function vetoExternal(value: Omit<types.pallet_democracy.pallet.Call.vetoExternal, "type">) {
  return { type: "Democracy", value: { ...value, type: "vetoExternal" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "cancelReferendum" } }
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
export function cancelQueued(value: Omit<types.pallet_democracy.pallet.Call.cancelQueued, "type">) {
  return { type: "Democracy", value: { ...value, type: "cancelQueued" } }
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
export function delegate(value: Omit<types.pallet_democracy.pallet.Call.delegate, "type">) {
  return { type: "Democracy", value: { ...value, type: "delegate" } }
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
export function undelegate() {
  return { type: "Democracy", value: { type: "undelegate" } }
}

/**
 * Clears all public proposals.
 *
 * The dispatch origin of this call must be _Root_.
 *
 * Weight: `O(1)`.
 */
export function clearPublicProposals() {
  return { type: "Democracy", value: { type: "clearPublicProposals" } }
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
export function notePreimage(value: Omit<types.pallet_democracy.pallet.Call.notePreimage, "type">) {
  return { type: "Democracy", value: { ...value, type: "notePreimage" } }
}

/** Same as `note_preimage` but origin is `OperationalPreimageOrigin`. */
export function notePreimageOperational(
  value: Omit<types.pallet_democracy.pallet.Call.notePreimageOperational, "type">,
) {
  return { type: "Democracy", value: { ...value, type: "notePreimageOperational" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "noteImminentPreimage" } }
}

/** Same as `note_imminent_preimage` but origin is `OperationalPreimageOrigin`. */
export function noteImminentPreimageOperational(
  value: Omit<types.pallet_democracy.pallet.Call.noteImminentPreimageOperational, "type">,
) {
  return { type: "Democracy", value: { ...value, type: "noteImminentPreimageOperational" } }
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
export function reapPreimage(value: Omit<types.pallet_democracy.pallet.Call.reapPreimage, "type">) {
  return { type: "Democracy", value: { ...value, type: "reapPreimage" } }
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
export function unlock(value: Omit<types.pallet_democracy.pallet.Call.unlock, "type">) {
  return { type: "Democracy", value: { ...value, type: "unlock" } }
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
export function removeVote(value: Omit<types.pallet_democracy.pallet.Call.removeVote, "type">) {
  return { type: "Democracy", value: { ...value, type: "removeVote" } }
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
) {
  return { type: "Democracy", value: { ...value, type: "removeOtherVote" } }
}

/** Enact a proposal from a referendum. For now we just make the weight be the maximum. */
export function enactProposal(
  value: Omit<types.pallet_democracy.pallet.Call.enactProposal, "type">,
) {
  return { type: "Democracy", value: { ...value, type: "enactProposal" } }
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
export function blacklist(value: Omit<types.pallet_democracy.pallet.Call.blacklist, "type">) {
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
export function cancelProposal(
  value: Omit<types.pallet_democracy.pallet.Call.cancelProposal, "type">,
) {
  return { type: "Democracy", value: { ...value, type: "cancelProposal" } }
}

/**
 *  The period between a proposal being approved and enacted.
 *
 *  It should generally be a little more than the unstake period to ensure that
 *  voting stakers have an opportunity to remove themselves from the system in the case
 *  where they are on the losing side of a vote.
 */
export const EnactmentPeriod: types.u32 = codecs.$4.decode(C.hex.decode("00270600" as C.Hex))

/** How often (in blocks) new public referenda are launched. */
export const LaunchPeriod: types.u32 = codecs.$4.decode(C.hex.decode("00270600" as C.Hex))

/** How often (in blocks) to check for new votes. */
export const VotingPeriod: types.u32 = codecs.$4.decode(C.hex.decode("00270600" as C.Hex))

/**
 *  The minimum period of vote locking.
 *
 *  It should be no shorter than enactment period to ensure that in the case of an approval,
 *  those successful voters are locked into the consequences that their votes entail.
 */
export const VoteLockingPeriod: types.u32 = codecs.$4.decode(C.hex.decode("00270600" as C.Hex))

/** The minimum amount to be used as a deposit for a public referendum proposal. */
export const MinimumDeposit: types.u128 = codecs.$6.decode(
  C.hex.decode("0010a5d4e80000000000000000000000" as C.Hex),
)

/**
 *  Indicator for whether an emergency origin is even allowed to happen. Some chains may
 *  want to set this permanently to `false`, others may want to condition it on things such
 *  as an upgrade having happened recently.
 */
export const InstantAllowed: boolean = codecs.$43.decode(C.hex.decode("01" as C.Hex))

/** Minimum voting period allowed for a fast-track referendum. */
export const FastTrackVotingPeriod: types.u32 = codecs.$4.decode(C.hex.decode("08070000" as C.Hex))

/** Period in blocks where an external proposal may not be re-submitted after being vetoed. */
export const CooloffPeriod: types.u32 = codecs.$4.decode(C.hex.decode("c0890100" as C.Hex))

/** The amount of balance that must be deposited per byte of preimage stored. */
export const PreimageByteDeposit: types.u128 = codecs.$6.decode(
  C.hex.decode("80969800000000000000000000000000" as C.Hex),
)

/**
 *  The maximum number of votes for an account.
 *
 *  Also used to compute weight, an overly big value can
 *  lead to extrinsic with very big weight: see `delegate` for instance.
 */
export const MaxVotes: types.u32 = codecs.$4.decode(C.hex.decode("64000000" as C.Hex))

/** The maximum number of public proposals that can exist at any time. */
export const MaxProposals: types.u32 = codecs.$4.decode(C.hex.decode("64000000" as C.Hex))
