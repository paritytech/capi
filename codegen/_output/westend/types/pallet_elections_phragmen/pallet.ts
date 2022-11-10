import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_elections_phragmen.pallet.Call> = _codec.$241

export const $error: $.Codec<t.types.pallet_elections_phragmen.pallet.Error> = _codec.$553

export const $event: $.Codec<t.types.pallet_elections_phragmen.pallet.Event> = _codec.$67

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_elections_phragmen.pallet.Call.vote
  | t.types.pallet_elections_phragmen.pallet.Call.remove_voter
  | t.types.pallet_elections_phragmen.pallet.Call.submit_candidacy
  | t.types.pallet_elections_phragmen.pallet.Call.renounce_candidacy
  | t.types.pallet_elections_phragmen.pallet.Call.remove_member
  | t.types.pallet_elections_phragmen.pallet.Call.clean_defunct_voters
export namespace Call {
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
  export interface vote {
    type: "vote"
    votes: Array<t.types.sp_core.crypto.AccountId32>
    value: t.Compact<t.types.u128>
  }
  /**
   * Remove `origin` as a voter.
   *
   * This removes the lock and returns the deposit.
   *
   * The dispatch origin of this call must be signed and be a voter.
   */
  export interface remove_voter {
    type: "remove_voter"
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
  export interface submit_candidacy {
    type: "submit_candidacy"
    candidate_count: t.Compact<t.types.u32>
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
  export interface renounce_candidacy {
    type: "renounce_candidacy"
    renouncing: t.types.pallet_elections_phragmen.Renouncing
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
  export interface remove_member {
    type: "remove_member"
    who: t.types.sp_runtime.multiaddress.MultiAddress
    slash_bond: boolean
    rerun_election: boolean
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
  export interface clean_defunct_voters {
    type: "clean_defunct_voters"
    num_voters: t.types.u32
    num_defunct: t.types.u32
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
    value: Omit<t.types.pallet_elections_phragmen.pallet.Call.vote, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Call.vote {
    return { type: "vote", ...value }
  }
  /**
   * Remove `origin` as a voter.
   *
   * This removes the lock and returns the deposit.
   *
   * The dispatch origin of this call must be signed and be a voter.
   */
  export function remove_voter(): t.types.pallet_elections_phragmen.pallet.Call.remove_voter {
    return { type: "remove_voter" }
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
    value: Omit<t.types.pallet_elections_phragmen.pallet.Call.submit_candidacy, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Call.submit_candidacy {
    return { type: "submit_candidacy", ...value }
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
    value: Omit<t.types.pallet_elections_phragmen.pallet.Call.renounce_candidacy, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Call.renounce_candidacy {
    return { type: "renounce_candidacy", ...value }
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
    value: Omit<t.types.pallet_elections_phragmen.pallet.Call.remove_member, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Call.remove_member {
    return { type: "remove_member", ...value }
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
  export function clean_defunct_voters(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Call.clean_defunct_voters, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Call.clean_defunct_voters {
    return { type: "clean_defunct_voters", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "UnableToVote"
  | "NoVotes"
  | "TooManyVotes"
  | "MaximumVotesExceeded"
  | "LowBalance"
  | "UnableToPayBond"
  | "MustBeVoter"
  | "DuplicatedCandidate"
  | "TooManyCandidates"
  | "MemberSubmit"
  | "RunnerUpSubmit"
  | "InsufficientCandidateFunds"
  | "NotMember"
  | "InvalidWitnessData"
  | "InvalidVoteCount"
  | "InvalidRenouncing"
  | "InvalidReplacement"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.pallet_elections_phragmen.pallet.Event.NewTerm
  | t.types.pallet_elections_phragmen.pallet.Event.EmptyTerm
  | t.types.pallet_elections_phragmen.pallet.Event.ElectionError
  | t.types.pallet_elections_phragmen.pallet.Event.MemberKicked
  | t.types.pallet_elections_phragmen.pallet.Event.Renounced
  | t.types.pallet_elections_phragmen.pallet.Event.CandidateSlashed
  | t.types.pallet_elections_phragmen.pallet.Event.SeatHolderSlashed
export namespace Event {
  /**
   * A new term with new_members. This indicates that enough candidates existed to run
   * the election, not that enough have has been elected. The inner value must be examined
   * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   * begin with.
   */
  export interface NewTerm {
    type: "NewTerm"
    new_members: Array<[t.types.sp_core.crypto.AccountId32, t.types.u128]>
  }
  /**
   * No (or not enough) candidates existed for this round. This is different from
   * `NewTerm(\[\])`. See the description of `NewTerm`.
   */
  export interface EmptyTerm {
    type: "EmptyTerm"
  }
  /** Internal error happened while trying to perform election. */
  export interface ElectionError {
    type: "ElectionError"
  }
  /**
   * A member has been removed. This should always be followed by either `NewTerm` or
   * `EmptyTerm`.
   */
  export interface MemberKicked {
    type: "MemberKicked"
    member: t.types.sp_core.crypto.AccountId32
  }
  /** Someone has renounced their candidacy. */
  export interface Renounced {
    type: "Renounced"
    candidate: t.types.sp_core.crypto.AccountId32
  }
  /**
   * A candidate was slashed by amount due to failing to obtain a seat as member or
   * runner-up.
   *
   * Note that old members and runners-up are also candidates.
   */
  export interface CandidateSlashed {
    type: "CandidateSlashed"
    candidate: t.types.sp_core.crypto.AccountId32
    amount: t.types.u128
  }
  /** A seat holder was slashed by amount by being forcefully removed from the set. */
  export interface SeatHolderSlashed {
    type: "SeatHolderSlashed"
    seat_holder: t.types.sp_core.crypto.AccountId32
    amount: t.types.u128
  }
  /**
   * A new term with new_members. This indicates that enough candidates existed to run
   * the election, not that enough have has been elected. The inner value must be examined
   * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   * begin with.
   */
  export function NewTerm(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Event.NewTerm, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Event.NewTerm {
    return { type: "NewTerm", ...value }
  }
  /**
   * No (or not enough) candidates existed for this round. This is different from
   * `NewTerm(\[\])`. See the description of `NewTerm`.
   */
  export function EmptyTerm(): t.types.pallet_elections_phragmen.pallet.Event.EmptyTerm {
    return { type: "EmptyTerm" }
  }
  /** Internal error happened while trying to perform election. */
  export function ElectionError(): t.types.pallet_elections_phragmen.pallet.Event.ElectionError {
    return { type: "ElectionError" }
  }
  /**
   * A member has been removed. This should always be followed by either `NewTerm` or
   * `EmptyTerm`.
   */
  export function MemberKicked(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Event.MemberKicked, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Event.MemberKicked {
    return { type: "MemberKicked", ...value }
  }
  /** Someone has renounced their candidacy. */
  export function Renounced(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Event.Renounced, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Event.Renounced {
    return { type: "Renounced", ...value }
  }
  /**
   * A candidate was slashed by amount due to failing to obtain a seat as member or
   * runner-up.
   *
   * Note that old members and runners-up are also candidates.
   */
  export function CandidateSlashed(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Event.CandidateSlashed, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Event.CandidateSlashed {
    return { type: "CandidateSlashed", ...value }
  }
  /** A seat holder was slashed by amount by being forcefully removed from the set. */
  export function SeatHolderSlashed(
    value: Omit<t.types.pallet_elections_phragmen.pallet.Event.SeatHolderSlashed, "type">,
  ): t.types.pallet_elections_phragmen.pallet.Event.SeatHolderSlashed {
    return { type: "SeatHolderSlashed", ...value }
  }
}
