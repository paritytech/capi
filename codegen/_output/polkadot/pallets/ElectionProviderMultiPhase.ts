import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** Current phase. */
export const CurrentPhase = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$600,
}

/**
 *  Desired number of targets to elect for this round.
 *
 *  Only exists when [`Snapshot`] is present.
 */
export const DesiredTargets = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  The minimum score that each 'untrusted' solution must attain in order to be considered
 *  feasible.
 *
 *  Can be set via `set_minimum_untrusted_score`.
 */
export const MinimumUntrustedScore = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$88,
}

/** Current best solution, signed or unsigned, queued to be returned upon `elect`. */
export const QueuedSolution = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$602,
}

/**
 *  Internal counter for the number of rounds.
 *
 *  This is useful for de-duplication of transactions submitted to the pool, and general
 *  diagnostics of the pallet.
 *
 *  This is merely incremented once per every time that an upstream `elect` is called.
 */
export const Round = { type: "Plain", modifier: "Default", hashers: [], key: [], value: _codec.$4 }

/**
 *  A sorted, bounded set of `(score, index)`, where each `index` points to a value in
 *  `SignedSubmissions`.
 *
 *  We never need to process more than a single signed submission at a time. Signed submissions
 *  can be quite large, so we're willing to pay the cost of multiple database accesses to access
 *  them one at a time instead of reading and decoding all of them at once.
 */
export const SignedSubmissionIndices = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$606,
}

/**
 *  The next index to be assigned to an incoming signed submission.
 *
 *  Every accepted submission is assigned a unique index; that index is bound to that particular
 *  submission for the duration of the election. On election finalization, the next index is
 *  reset to 0.
 *
 *  We can't just use `SignedSubmissionIndices.len()`, because that's a bounded set; past its
 *  capacity, it will simply saturate. We can't just iterate over `SignedSubmissionsMap`,
 *  because iteration is slow. Instead, we store the value here.
 */
export const SignedSubmissionNextIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Unchecked, signed solutions.
 *
 *  Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
 *  allowing us to keep only a single one in memory at a time.
 *
 *  Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
 *  affect; we shouldn't need a cryptographically secure hasher.
 */
export const SignedSubmissionsMap = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$610,
}

/**
 *  Snapshot data of the round.
 *
 *  This is created at the beginning of the signed phase and cleared upon calling `elect`.
 */
export const Snapshot = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$603,
}

/**
 *  The metadata of the [`RoundSnapshot`]
 *
 *  Only exists when [`Snapshot`] is present.
 */
export const SnapshotMetadata = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$363,
}

/**
 * Trigger the governance fallback.
 *
 * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
 * calling [`Call::set_emergency_election_result`].
 */
export function governance_fallback(
  value: Omit<t.pallet_election_provider_multi_phase.pallet.Call.governance_fallback, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "governance_fallback" } }
}

/**
 * Set a solution in the queue, to be handed out to the client of this pallet in the next
 * call to `ElectionProvider::elect`.
 *
 * This can only be set by `T::ForceOrigin`, and only when the phase is `Emergency`.
 *
 * The solution is not checked for any feasibility and is assumed to be trustworthy, as any
 * feasibility check itself can in principle cause the election process to fail (due to
 * memory/weight constrains).
 */
export function set_emergency_election_result(
  value: Omit<
    t.pallet_election_provider_multi_phase.pallet.Call.set_emergency_election_result,
    "type"
  >,
): t.polkadot_runtime.RuntimeCall {
  return {
    type: "ElectionProviderMultiPhase",
    value: { ...value, type: "set_emergency_election_result" },
  }
}

/**
 * Set a new value for `MinimumUntrustedScore`.
 *
 * Dispatch origin must be aligned with `T::ForceOrigin`.
 *
 * This check can be turned off by setting the value to `None`.
 */
export function set_minimum_untrusted_score(
  value: Omit<
    t.pallet_election_provider_multi_phase.pallet.Call.set_minimum_untrusted_score,
    "type"
  >,
): t.polkadot_runtime.RuntimeCall {
  return {
    type: "ElectionProviderMultiPhase",
    value: { ...value, type: "set_minimum_untrusted_score" },
  }
}

/**
 * Submit a solution for the signed phase.
 *
 * The dispatch origin fo this call must be __signed__.
 *
 * The solution is potentially queued, based on the claimed score and processed at the end
 * of the signed phase.
 *
 * A deposit is reserved and recorded for the solution. Based on the outcome, the solution
 * might be rewarded, slashed, or get all or a part of the deposit back.
 */
export function submit(
  value: Omit<t.pallet_election_provider_multi_phase.pallet.Call.submit, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "submit" } }
}

/**
 * Submit a solution for the unsigned phase.
 *
 * The dispatch origin fo this call must be __none__.
 *
 * This submission is checked on the fly. Moreover, this unsigned solution is only
 * validated when submitted to the pool from the **local** node. Effectively, this means
 * that only active validators can submit this transaction when authoring a block (similar
 * to an inherent).
 *
 * To prevent any incorrect solution (and thus wasted time/weight), this transaction will
 * panic if the solution submitted by the validator is invalid in any way, effectively
 * putting their authoring reward at risk.
 *
 * No deposit or reward is associated with this submission.
 */
export function submit_unsigned(
  value: Omit<t.pallet_election_provider_multi_phase.pallet.Call.submit_unsigned, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "submit_unsigned" } }
}
