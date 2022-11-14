import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  The present candidate list. A current member or runner-up can never enter this vector
 *  and is always implicitly assumed to be a candidate.
 *
 *  Second element is the deposit.
 *
 *  Invariant: Always sorted based on account id.
 */
export const Candidates = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "PhragmenElection",
  "Candidates",
  $.tuple(),
  _codec.$68,
)

/** The total number of vote rounds that have happened, excluding the upcoming one. */
export const ElectionRounds = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "PhragmenElection",
  "ElectionRounds",
  $.tuple(),
  _codec.$4,
)

/**
 *  The current elected members.
 *
 *  Invariant: Always sorted based on account id.
 */
export const Members = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "PhragmenElection",
  "Members",
  $.tuple(),
  _codec.$550,
)

/**
 *  The current reserved runners-up.
 *
 *  Invariant: Always sorted based on rank (worse to best). Upon removal of a member, the
 *  last (i.e. _best_) runner-up will be replaced.
 */
export const RunnersUp = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "PhragmenElection",
  "RunnersUp",
  $.tuple(),
  _codec.$550,
)

/**
 *  Votes and locked stake of a particular voter.
 *
 *  TWOX-NOTE: SAFE as `AccountId` is a crypto hash.
 */
export const Voting = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "PhragmenElection",
  "Voting",
  $.tuple(_codec.$0),
  _codec.$552,
)

/**
 * Clean all voters who are defunct (i.e. they do not serve any purpose at all). The
 * deposit of the removed voters are returned.
 *
 * This is an root function to be used only for cleaning the state.
 *
 * The dispatch origin of this call must be root.
 *
 * # <weight>
 * The total number of voters and those that are defunct must be provided as witness data.
 * # </weight>
 */
export function clean_defunct_voters(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.clean_defunct_voters, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { ...value, type: "clean_defunct_voters" } }
}

/**
 * Remove a particular member from the set. This is effective immediately and the bond of
 * the outgoing member is slashed.
 *
 * If a runner-up is available, then the best runner-up will be removed and replaces the
 * outgoing member. Otherwise, if `rerun_election` is `true`, a new phragmen election is
 * started, else, nothing happens.
 *
 * If `slash_bond` is set to true, the bond of the member being removed is slashed. Else,
 * it is returned.
 *
 * The dispatch origin of this call must be root.
 *
 * Note that this does not affect the designated block number of the next election.
 *
 * # <weight>
 * If we have a replacement, we use a small weight. Else, since this is a root call and
 * will go into phragmen, we assume full block for now.
 * # </weight>
 */
export function remove_member(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.remove_member, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { ...value, type: "remove_member" } }
}

/**
 * Remove `origin` as a voter.
 *
 * This removes the lock and returns the deposit.
 *
 * The dispatch origin of this call must be signed and be a voter.
 */
export function remove_voter(): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { type: "remove_voter" } }
}

/**
 * Renounce one's intention to be a candidate for the next election round. 3 potential
 * outcomes exist:
 *
 * - `origin` is a candidate and not elected in any set. In this case, the deposit is
 *   unreserved, returned and origin is removed as a candidate.
 * - `origin` is a current runner-up. In this case, the deposit is unreserved, returned and
 *   origin is removed as a runner-up.
 * - `origin` is a current member. In this case, the deposit is unreserved and origin is
 *   removed as a member, consequently not being a candidate for the next round anymore.
 *   Similar to [`remove_member`](Self::remove_member), if replacement runners exists, they
 *   are immediately used. If the prime is renouncing, then no prime will exist until the
 *   next round.
 *
 * The dispatch origin of this call must be signed, and have one of the above roles.
 *
 * # <weight>
 * The type of renouncing must be provided as witness data.
 * # </weight>
 */
export function renounce_candidacy(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.renounce_candidacy, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { ...value, type: "renounce_candidacy" } }
}

/**
 * Submit oneself for candidacy. A fixed amount of deposit is recorded.
 *
 * All candidates are wiped at the end of the term. They either become a member/runner-up,
 * or leave the system while their deposit is slashed.
 *
 * The dispatch origin of this call must be signed.
 *
 * ### Warning
 *
 * Even if a candidate ends up being a member, they must call [`Call::renounce_candidacy`]
 * to get their deposit back. Losing the spot in an election will always lead to a slash.
 *
 * # <weight>
 * The number of current candidates must be provided as witness data.
 * # </weight>
 */
export function submit_candidacy(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.submit_candidacy, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { ...value, type: "submit_candidacy" } }
}

/**
 * Vote for a set of candidates for the upcoming round of election. This can be called to
 * set the initial votes, or update already existing votes.
 *
 * Upon initial voting, `value` units of `who`'s balance is locked and a deposit amount is
 * reserved. The deposit is based on the number of votes and can be updated over time.
 *
 * The `votes` should:
 *   - not be empty.
 *   - be less than the number of possible candidates. Note that all current members and
 *     runners-up are also automatically candidates for the next round.
 *
 * If `value` is more than `who`'s free balance, then the maximum of the two is used.
 *
 * The dispatch origin of this call must be signed.
 *
 * ### Warning
 *
 * It is the responsibility of the caller to **NOT** place all of their balance into the
 * lock and keep some for further operations.
 *
 * # <weight>
 * We assume the maximum weight among all 3 cases: vote_equal, vote_more and vote_less.
 * # </weight>
 */
export function vote(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.vote, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "PhragmenElection", value: { ...value, type: "vote" } }
}
