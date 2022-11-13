import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The current members of the collective. This is stored sorted (just by value). */
export const Members = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$206,
}

/** The prime member that helps determine the default vote behavior in case of absentations. */
export const Prime = { type: "Plain", modifier: "Optional", hashers: [], key: [], value: _codec.$0 }

/** Proposals so far. */
export const ProposalCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Actual proposal for a given hash, if it's current. */
export const ProposalOf = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$181,
}

/** The hashes of the active proposals. */
export const Proposals = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$545,
}

/** Votes on a given proposal, if it is ongoing. */
export const Voting = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$546,
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
  value: Omit<types.pallet_collective.pallet.Call.close, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "close" } }
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
  value: Omit<types.pallet_collective.pallet.Call.close_old_weight, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "close_old_weight" } }
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
  value: Omit<types.pallet_collective.pallet.Call.disapprove_proposal, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "disapprove_proposal" } }
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
  value: Omit<types.pallet_collective.pallet.Call.execute, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "execute" } }
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
  value: Omit<types.pallet_collective.pallet.Call.propose, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "propose" } }
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
  value: Omit<types.pallet_collective.pallet.Call.set_members, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "set_members" } }
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
  value: Omit<types.pallet_collective.pallet.Call.vote, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Council", value: { ...value, type: "vote" } }
}
