import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_collective.pallet.Call> = _codec.$237

export const $error: $.Codec<t.pallet_collective.pallet.Error> = _codec.$547

export const $event: $.Codec<t.pallet_collective.pallet.Event> = _codec.$65

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_collective.pallet.Call.set_members
  | t.pallet_collective.pallet.Call.execute
  | t.pallet_collective.pallet.Call.propose
  | t.pallet_collective.pallet.Call.vote
  | t.pallet_collective.pallet.Call.close_old_weight
  | t.pallet_collective.pallet.Call.disapprove_proposal
  | t.pallet_collective.pallet.Call.close
export namespace Call {
  /**
   * Set the collective's membership.
   *
   * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
   * - `prime`: The prime member whose vote sets the default.
   * - `old_count`: The upper bound for the previous number of members in storage. Used for
   *   weight estimation.
   *
   * Requires root origin.
   *
   * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
   *       the weight estimations rely on it to estimate dispatchable weight.
   *
   * # WARNING:
   *
   * The `pallet-collective` can also be managed by logic outside of the pallet through the
   * implementation of the trait [`ChangeMembers`].
   * Any call to `set_members` must be careful that the member set doesn't get out of sync
   * with other logic managing the member set.
   *
   * # <weight>
   * ## Weight
   * - `O(MP + N)` where:
   *   - `M` old-members-count (code- and governance-bounded)
   *   - `N` new-members-count (code- and governance-bounded)
   *   - `P` proposals-count (code-bounded)
   * - DB:
   *   - 1 storage mutation (codec `O(M)` read, `O(N)` write) for reading and writing the
   *     members
   *   - 1 storage read (codec `O(P)`) for reading the proposals
   *   - `P` storage mutations (codec `O(M)`) for updating the votes for each proposal
   *   - 1 storage write (codec `O(1)`) for deleting the old `prime` and setting the new one
   * # </weight>
   */
  export interface set_members {
    type: "set_members"
    new_members: Array<t.sp_core.crypto.AccountId32>
    prime: t.sp_core.crypto.AccountId32 | undefined
    old_count: t.u32
  }
  /**
   * Dispatch a proposal from a member using the `Member` origin.
   *
   * Origin must be a member of the collective.
   *
   * # <weight>
   * ## Weight
   * - `O(M + P)` where `M` members-count (code-bounded) and `P` complexity of dispatching
   *   `proposal`
   * - DB: 1 read (codec `O(M)`) + DB access of `proposal`
   * - 1 event
   * # </weight>
   */
  export interface execute {
    type: "execute"
    proposal: t.polkadot_runtime.RuntimeCall
    length_bound: t.Compact<t.u32>
  }
  /**
   * Add a new proposal to either be voted on or executed directly.
   *
   * Requires the sender to be member.
   *
   * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
   * or put up for voting.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1)` or `O(B + M + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - branching is influenced by `threshold` where:
   *     - `P1` is proposal execution complexity (`threshold < 2`)
   *     - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
   * - DB:
   *   - 1 storage read `is_member` (codec `O(M)`)
   *   - 1 storage read `ProposalOf::contains_key` (codec `O(1)`)
   *   - DB accesses influenced by `threshold`:
   *     - EITHER storage accesses done by `proposal` (`threshold < 2`)
   *     - OR proposal insertion (`threshold <= 2`)
   *       - 1 storage mutation `Proposals` (codec `O(P2)`)
   *       - 1 storage mutation `ProposalCount` (codec `O(1)`)
   *       - 1 storage write `ProposalOf` (codec `O(B)`)
   *       - 1 storage write `Voting` (codec `O(M)`)
   *   - 1 event
   * # </weight>
   */
  export interface propose {
    type: "propose"
    threshold: t.Compact<t.u32>
    proposal: t.polkadot_runtime.RuntimeCall
    length_bound: t.Compact<t.u32>
  }
  /**
   * Add an aye or nay vote for the sender to the given proposal.
   *
   * Requires the sender to be a member.
   *
   * Transaction fees will be waived if the member is voting on any particular proposal
   * for the first time and the call is successful. Subsequent vote changes will charge a
   * fee.
   * # <weight>
   * ## Weight
   * - `O(M)` where `M` is members-count (code- and governance-bounded)
   * - DB:
   *   - 1 storage read `Members` (codec `O(M)`)
   *   - 1 storage mutation `Voting` (codec `O(M)`)
   * - 1 event
   * # </weight>
   */
  export interface vote {
    type: "vote"
    proposal: t.primitive_types.H256
    index: t.Compact<t.u32>
    approve: boolean
  }
  /**
   * Close a vote that is either approved, disapproved or whose voting period has ended.
   *
   * May be called by any signed account in order to finish voting and close the proposal.
   *
   * If called before the end of the voting period it will only close the vote if it is
   * has enough votes to be approved or disapproved.
   *
   * If called after the end of the voting period abstentions are counted as rejections
   * unless there is a prime member set and the prime member cast an approval.
   *
   * If the close operation completes successfully with disapproval, the transaction fee will
   * be waived. Otherwise execution of the approved operation will be charged to the caller.
   *
   * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
   * proposal.
   * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
   * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1 + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - `P1` is the complexity of `proposal` preimage.
   *   - `P2` is proposal-count (code-bounded)
   * - DB:
   *  - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
   *  - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`, `Proposals`: codec
   *    `O(P2)`)
   *  - any mutations done while executing `proposal` (`P1`)
   * - up to 3 events
   * # </weight>
   */
  export interface close_old_weight {
    type: "close_old_weight"
    proposal_hash: t.primitive_types.H256
    index: t.Compact<t.u32>
    proposal_weight_bound: t.Compact<t.sp_weights.OldWeight>
    length_bound: t.Compact<t.u32>
  }
  /**
   * Disapprove a proposal, close, and remove it from the system, regardless of its current
   * state.
   *
   * Must be called by the Root origin.
   *
   * Parameters:
   * * `proposal_hash`: The hash of the proposal that should be disapproved.
   *
   * # <weight>
   * Complexity: O(P) where P is the number of max proposals
   * DB Weight:
   * * Reads: Proposals
   * * Writes: Voting, Proposals, ProposalOf
   * # </weight>
   */
  export interface disapprove_proposal {
    type: "disapprove_proposal"
    proposal_hash: t.primitive_types.H256
  }
  /**
   * Close a vote that is either approved, disapproved or whose voting period has ended.
   *
   * May be called by any signed account in order to finish voting and close the proposal.
   *
   * If called before the end of the voting period it will only close the vote if it is
   * has enough votes to be approved or disapproved.
   *
   * If called after the end of the voting period abstentions are counted as rejections
   * unless there is a prime member set and the prime member cast an approval.
   *
   * If the close operation completes successfully with disapproval, the transaction fee will
   * be waived. Otherwise execution of the approved operation will be charged to the caller.
   *
   * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
   * proposal.
   * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
   * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1 + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - `P1` is the complexity of `proposal` preimage.
   *   - `P2` is proposal-count (code-bounded)
   * - DB:
   *  - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
   *  - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`, `Proposals`: codec
   *    `O(P2)`)
   *  - any mutations done while executing `proposal` (`P1`)
   * - up to 3 events
   * # </weight>
   */
  export interface close {
    type: "close"
    proposal_hash: t.primitive_types.H256
    index: t.Compact<t.u32>
    proposal_weight_bound: t.sp_weights.weight_v2.Weight
    length_bound: t.Compact<t.u32>
  }
  /**
   * Set the collective's membership.
   *
   * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
   * - `prime`: The prime member whose vote sets the default.
   * - `old_count`: The upper bound for the previous number of members in storage. Used for
   *   weight estimation.
   *
   * Requires root origin.
   *
   * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
   *       the weight estimations rely on it to estimate dispatchable weight.
   *
   * # WARNING:
   *
   * The `pallet-collective` can also be managed by logic outside of the pallet through the
   * implementation of the trait [`ChangeMembers`].
   * Any call to `set_members` must be careful that the member set doesn't get out of sync
   * with other logic managing the member set.
   *
   * # <weight>
   * ## Weight
   * - `O(MP + N)` where:
   *   - `M` old-members-count (code- and governance-bounded)
   *   - `N` new-members-count (code- and governance-bounded)
   *   - `P` proposals-count (code-bounded)
   * - DB:
   *   - 1 storage mutation (codec `O(M)` read, `O(N)` write) for reading and writing the
   *     members
   *   - 1 storage read (codec `O(P)`) for reading the proposals
   *   - `P` storage mutations (codec `O(M)`) for updating the votes for each proposal
   *   - 1 storage write (codec `O(1)`) for deleting the old `prime` and setting the new one
   * # </weight>
   */
  export function set_members(
    value: Omit<t.pallet_collective.pallet.Call.set_members, "type">,
  ): t.pallet_collective.pallet.Call.set_members {
    return { type: "set_members", ...value }
  }
  /**
   * Dispatch a proposal from a member using the `Member` origin.
   *
   * Origin must be a member of the collective.
   *
   * # <weight>
   * ## Weight
   * - `O(M + P)` where `M` members-count (code-bounded) and `P` complexity of dispatching
   *   `proposal`
   * - DB: 1 read (codec `O(M)`) + DB access of `proposal`
   * - 1 event
   * # </weight>
   */
  export function execute(
    value: Omit<t.pallet_collective.pallet.Call.execute, "type">,
  ): t.pallet_collective.pallet.Call.execute {
    return { type: "execute", ...value }
  }
  /**
   * Add a new proposal to either be voted on or executed directly.
   *
   * Requires the sender to be member.
   *
   * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
   * or put up for voting.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1)` or `O(B + M + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - branching is influenced by `threshold` where:
   *     - `P1` is proposal execution complexity (`threshold < 2`)
   *     - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
   * - DB:
   *   - 1 storage read `is_member` (codec `O(M)`)
   *   - 1 storage read `ProposalOf::contains_key` (codec `O(1)`)
   *   - DB accesses influenced by `threshold`:
   *     - EITHER storage accesses done by `proposal` (`threshold < 2`)
   *     - OR proposal insertion (`threshold <= 2`)
   *       - 1 storage mutation `Proposals` (codec `O(P2)`)
   *       - 1 storage mutation `ProposalCount` (codec `O(1)`)
   *       - 1 storage write `ProposalOf` (codec `O(B)`)
   *       - 1 storage write `Voting` (codec `O(M)`)
   *   - 1 event
   * # </weight>
   */
  export function propose(
    value: Omit<t.pallet_collective.pallet.Call.propose, "type">,
  ): t.pallet_collective.pallet.Call.propose {
    return { type: "propose", ...value }
  }
  /**
   * Add an aye or nay vote for the sender to the given proposal.
   *
   * Requires the sender to be a member.
   *
   * Transaction fees will be waived if the member is voting on any particular proposal
   * for the first time and the call is successful. Subsequent vote changes will charge a
   * fee.
   * # <weight>
   * ## Weight
   * - `O(M)` where `M` is members-count (code- and governance-bounded)
   * - DB:
   *   - 1 storage read `Members` (codec `O(M)`)
   *   - 1 storage mutation `Voting` (codec `O(M)`)
   * - 1 event
   * # </weight>
   */
  export function vote(
    value: Omit<t.pallet_collective.pallet.Call.vote, "type">,
  ): t.pallet_collective.pallet.Call.vote {
    return { type: "vote", ...value }
  }
  /**
   * Close a vote that is either approved, disapproved or whose voting period has ended.
   *
   * May be called by any signed account in order to finish voting and close the proposal.
   *
   * If called before the end of the voting period it will only close the vote if it is
   * has enough votes to be approved or disapproved.
   *
   * If called after the end of the voting period abstentions are counted as rejections
   * unless there is a prime member set and the prime member cast an approval.
   *
   * If the close operation completes successfully with disapproval, the transaction fee will
   * be waived. Otherwise execution of the approved operation will be charged to the caller.
   *
   * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
   * proposal.
   * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
   * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1 + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - `P1` is the complexity of `proposal` preimage.
   *   - `P2` is proposal-count (code-bounded)
   * - DB:
   *  - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
   *  - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`, `Proposals`: codec
   *    `O(P2)`)
   *  - any mutations done while executing `proposal` (`P1`)
   * - up to 3 events
   * # </weight>
   */
  export function close_old_weight(
    value: Omit<t.pallet_collective.pallet.Call.close_old_weight, "type">,
  ): t.pallet_collective.pallet.Call.close_old_weight {
    return { type: "close_old_weight", ...value }
  }
  /**
   * Disapprove a proposal, close, and remove it from the system, regardless of its current
   * state.
   *
   * Must be called by the Root origin.
   *
   * Parameters:
   * * `proposal_hash`: The hash of the proposal that should be disapproved.
   *
   * # <weight>
   * Complexity: O(P) where P is the number of max proposals
   * DB Weight:
   * * Reads: Proposals
   * * Writes: Voting, Proposals, ProposalOf
   * # </weight>
   */
  export function disapprove_proposal(
    value: Omit<t.pallet_collective.pallet.Call.disapprove_proposal, "type">,
  ): t.pallet_collective.pallet.Call.disapprove_proposal {
    return { type: "disapprove_proposal", ...value }
  }
  /**
   * Close a vote that is either approved, disapproved or whose voting period has ended.
   *
   * May be called by any signed account in order to finish voting and close the proposal.
   *
   * If called before the end of the voting period it will only close the vote if it is
   * has enough votes to be approved or disapproved.
   *
   * If called after the end of the voting period abstentions are counted as rejections
   * unless there is a prime member set and the prime member cast an approval.
   *
   * If the close operation completes successfully with disapproval, the transaction fee will
   * be waived. Otherwise execution of the approved operation will be charged to the caller.
   *
   * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
   * proposal.
   * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
   * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
   *
   * # <weight>
   * ## Weight
   * - `O(B + M + P1 + P2)` where:
   *   - `B` is `proposal` size in bytes (length-fee-bounded)
   *   - `M` is members-count (code- and governance-bounded)
   *   - `P1` is the complexity of `proposal` preimage.
   *   - `P2` is proposal-count (code-bounded)
   * - DB:
   *  - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
   *  - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`, `Proposals`: codec
   *    `O(P2)`)
   *  - any mutations done while executing `proposal` (`P1`)
   * - up to 3 events
   * # </weight>
   */
  export function close(
    value: Omit<t.pallet_collective.pallet.Call.close, "type">,
  ): t.pallet_collective.pallet.Call.close {
    return { type: "close", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "NotMember"
  | "DuplicateProposal"
  | "ProposalMissing"
  | "WrongIndex"
  | "DuplicateVote"
  | "AlreadyInitialized"
  | "TooEarly"
  | "TooManyProposals"
  | "WrongProposalWeight"
  | "WrongProposalLength"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_collective.pallet.Event.Proposed
  | t.pallet_collective.pallet.Event.Voted
  | t.pallet_collective.pallet.Event.Approved
  | t.pallet_collective.pallet.Event.Disapproved
  | t.pallet_collective.pallet.Event.Executed
  | t.pallet_collective.pallet.Event.MemberExecuted
  | t.pallet_collective.pallet.Event.Closed
export namespace Event {
  /**
   * A motion (given hash) has been proposed (by given account) with a threshold (given
   * `MemberCount`).
   */
  export interface Proposed {
    type: "Proposed"
    account: t.sp_core.crypto.AccountId32
    proposal_index: t.u32
    proposal_hash: t.primitive_types.H256
    threshold: t.u32
  }
  /**
   * A motion (given hash) has been voted on by given account, leaving
   * a tally (yes votes and no votes given respectively as `MemberCount`).
   */
  export interface Voted {
    type: "Voted"
    account: t.sp_core.crypto.AccountId32
    proposal_hash: t.primitive_types.H256
    voted: boolean
    yes: t.u32
    no: t.u32
  }
  /** A motion was approved by the required threshold. */
  export interface Approved {
    type: "Approved"
    proposal_hash: t.primitive_types.H256
  }
  /** A motion was not approved by the required threshold. */
  export interface Disapproved {
    type: "Disapproved"
    proposal_hash: t.primitive_types.H256
  }
  /** A motion was executed; result will be `Ok` if it returned without error. */
  export interface Executed {
    type: "Executed"
    proposal_hash: t.primitive_types.H256
    result: null | ChainError<t.sp_runtime.DispatchError>
  }
  /** A single member did some action; result will be `Ok` if it returned without error. */
  export interface MemberExecuted {
    type: "MemberExecuted"
    proposal_hash: t.primitive_types.H256
    result: null | ChainError<t.sp_runtime.DispatchError>
  }
  /** A proposal was closed because its threshold was reached or after its duration was up. */
  export interface Closed {
    type: "Closed"
    proposal_hash: t.primitive_types.H256
    yes: t.u32
    no: t.u32
  }
  /**
   * A motion (given hash) has been proposed (by given account) with a threshold (given
   * `MemberCount`).
   */
  export function Proposed(
    value: Omit<t.pallet_collective.pallet.Event.Proposed, "type">,
  ): t.pallet_collective.pallet.Event.Proposed {
    return { type: "Proposed", ...value }
  }
  /**
   * A motion (given hash) has been voted on by given account, leaving
   * a tally (yes votes and no votes given respectively as `MemberCount`).
   */
  export function Voted(
    value: Omit<t.pallet_collective.pallet.Event.Voted, "type">,
  ): t.pallet_collective.pallet.Event.Voted {
    return { type: "Voted", ...value }
  }
  /** A motion was approved by the required threshold. */
  export function Approved(
    value: Omit<t.pallet_collective.pallet.Event.Approved, "type">,
  ): t.pallet_collective.pallet.Event.Approved {
    return { type: "Approved", ...value }
  }
  /** A motion was not approved by the required threshold. */
  export function Disapproved(
    value: Omit<t.pallet_collective.pallet.Event.Disapproved, "type">,
  ): t.pallet_collective.pallet.Event.Disapproved {
    return { type: "Disapproved", ...value }
  }
  /** A motion was executed; result will be `Ok` if it returned without error. */
  export function Executed(
    value: Omit<t.pallet_collective.pallet.Event.Executed, "type">,
  ): t.pallet_collective.pallet.Event.Executed {
    return { type: "Executed", ...value }
  }
  /** A single member did some action; result will be `Ok` if it returned without error. */
  export function MemberExecuted(
    value: Omit<t.pallet_collective.pallet.Event.MemberExecuted, "type">,
  ): t.pallet_collective.pallet.Event.MemberExecuted {
    return { type: "MemberExecuted", ...value }
  }
  /** A proposal was closed because its threshold was reached or after its duration was up. */
  export function Closed(
    value: Omit<t.pallet_collective.pallet.Event.Closed, "type">,
  ): t.pallet_collective.pallet.Event.Closed {
    return { type: "Closed", ...value }
  }
}
