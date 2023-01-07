import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

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
  codecs.$545,
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
  codecs.$545,
)

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
  codecs.$69,
)

/** The total number of vote rounds that have happened, excluding the upcoming one. */
export const ElectionRounds = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "PhragmenElection",
  "ElectionRounds",
  $.tuple(),
  codecs.$4,
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
  $.tuple(codecs.$0),
  codecs.$547,
)

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
export function vote(value: Omit<types.pallet_elections_phragmen.pallet.Call.vote, "type">) {
  return { type: "PhragmenElection", value: { ...value, type: "vote" } }
}

/**
 * Remove `origin` as a voter.
 *
 * This removes the lock and returns the deposit.
 *
 * The dispatch origin of this call must be signed and be a voter.
 */
export function removeVoter() {
  return { type: "PhragmenElection", value: { type: "removeVoter" } }
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
export function submitCandidacy(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.submitCandidacy, "type">,
) {
  return { type: "PhragmenElection", value: { ...value, type: "submitCandidacy" } }
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
export function renounceCandidacy(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.renounceCandidacy, "type">,
) {
  return { type: "PhragmenElection", value: { ...value, type: "renounceCandidacy" } }
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
export function removeMember(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.removeMember, "type">,
) {
  return { type: "PhragmenElection", value: { ...value, type: "removeMember" } }
}

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
export function cleanDefunctVoters(
  value: Omit<types.pallet_elections_phragmen.pallet.Call.cleanDefunctVoters, "type">,
) {
  return { type: "PhragmenElection", value: { ...value, type: "cleanDefunctVoters" } }
}

/** Identifier for the elections-phragmen pallet's lock */
export const PalletId: Uint8Array = codecs.$139.decode(C.hex.decode("706872656c656374" as C.Hex))

/** How much should be locked up in order to submit one's candidacy. */
export const CandidacyBond: types.u128 = codecs.$6.decode(
  C.hex.decode("0010a5d4e80000000000000000000000" as C.Hex),
)

/**
 *  Base deposit associated with voting.
 *
 *  This should be sensibly high to economically ensure the pallet cannot be attacked by
 *  creating a gigantic number of votes.
 */
export const VotingBondBase: types.u128 = codecs.$6.decode(
  C.hex.decode("007013b72e0000000000000000000000" as C.Hex),
)

/** The amount of bond that need to be locked for each vote (32 bytes). */
export const VotingBondFactor: types.u128 = codecs.$6.decode(
  C.hex.decode("00d01213000000000000000000000000" as C.Hex),
)

/** Number of members to elect. */
export const DesiredMembers: types.u32 = codecs.$4.decode(C.hex.decode("0d000000" as C.Hex))

/** Number of runners_up to keep. */
export const DesiredRunnersUp: types.u32 = codecs.$4.decode(C.hex.decode("14000000" as C.Hex))

/**
 *  How long each seat is kept. This defines the next block number at which an election
 *  round will happen. If set to zero, no elections are ever triggered and the module will
 *  be in passive mode.
 */
export const TermDuration: types.u32 = codecs.$4.decode(C.hex.decode("c0890100" as C.Hex))

/**
 *  The maximum number of candidates in a phragmen election.
 *
 *  Warning: The election happens onchain, and this value will determine
 *  the size of the election. When this limit is reached no more
 *  candidates are accepted in the election.
 */
export const MaxCandidates: types.u32 = codecs.$4.decode(C.hex.decode("e8030000" as C.Hex))

/**
 *  The maximum number of voters to allow in a phragmen election.
 *
 *  Warning: This impacts the size of the election which is run onchain.
 *  When the limit is reached the new voters are ignored.
 */
export const MaxVoters: types.u32 = codecs.$4.decode(C.hex.decode("10270000" as C.Hex))
