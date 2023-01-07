import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  Internal counter for the number of rounds.
 *
 *  This is useful for de-duplication of transactions submitted to the pool, and general
 *  diagnostics of the pallet.
 *
 *  This is merely incremented once per every time that an upstream `elect` is called.
 */
export const Round = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ElectionProviderMultiPhase",
  "Round",
  $.tuple(),
  codecs.$4,
)

/** Current phase. */
export const CurrentPhase = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ElectionProviderMultiPhase",
  "CurrentPhase",
  $.tuple(),
  codecs.$596,
)

/** Current best solution, signed or unsigned, queued to be returned upon `elect`. */
export const QueuedSolution = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ElectionProviderMultiPhase",
  "QueuedSolution",
  $.tuple(),
  codecs.$598,
)

/**
 *  Snapshot data of the round.
 *
 *  This is created at the beginning of the signed phase and cleared upon calling `elect`.
 */
export const Snapshot = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ElectionProviderMultiPhase",
  "Snapshot",
  $.tuple(),
  codecs.$599,
)

/**
 *  Desired number of targets to elect for this round.
 *
 *  Only exists when [`Snapshot`] is present.
 */
export const DesiredTargets = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ElectionProviderMultiPhase",
  "DesiredTargets",
  $.tuple(),
  codecs.$4,
)

/**
 *  The metadata of the [`RoundSnapshot`]
 *
 *  Only exists when [`Snapshot`] is present.
 */
export const SnapshotMetadata = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ElectionProviderMultiPhase",
  "SnapshotMetadata",
  $.tuple(),
  codecs.$363,
)

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
export const SignedSubmissionNextIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ElectionProviderMultiPhase",
  "SignedSubmissionNextIndex",
  $.tuple(),
  codecs.$4,
)

/**
 *  A sorted, bounded set of `(score, index)`, where each `index` points to a value in
 *  `SignedSubmissions`.
 *
 *  We never need to process more than a single signed submission at a time. Signed submissions
 *  can be quite large, so we're willing to pay the cost of multiple database accesses to access
 *  them one at a time instead of reading and decoding all of them at once.
 */
export const SignedSubmissionIndices = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ElectionProviderMultiPhase",
  "SignedSubmissionIndices",
  $.tuple(),
  codecs.$602,
)

/**
 *  Unchecked, signed solutions.
 *
 *  Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
 *  allowing us to keep only a single one in memory at a time.
 *
 *  Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
 *  affect; we shouldn't need a cryptographically secure hasher.
 */
export const SignedSubmissionsMap = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ElectionProviderMultiPhase",
  "SignedSubmissionsMap",
  $.tuple(codecs.$4),
  codecs.$606,
)

/**
 *  The minimum score that each 'untrusted' solution must attain in order to be considered
 *  feasible.
 *
 *  Can be set via `set_minimum_untrusted_score`.
 */
export const MinimumUntrustedScore = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ElectionProviderMultiPhase",
  "MinimumUntrustedScore",
  $.tuple(),
  codecs.$89,
)

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
export function submitUnsigned(
  value: Omit<types.pallet_election_provider_multi_phase.pallet.Call.submitUnsigned, "type">,
) {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "submitUnsigned" } }
}

/**
 * Set a new value for `MinimumUntrustedScore`.
 *
 * Dispatch origin must be aligned with `T::ForceOrigin`.
 *
 * This check can be turned off by setting the value to `None`.
 */
export function setMinimumUntrustedScore(
  value: Omit<
    types.pallet_election_provider_multi_phase.pallet.Call.setMinimumUntrustedScore,
    "type"
  >,
) {
  return {
    type: "ElectionProviderMultiPhase",
    value: { ...value, type: "setMinimumUntrustedScore" },
  }
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
export function setEmergencyElectionResult(
  value: Omit<
    types.pallet_election_provider_multi_phase.pallet.Call.setEmergencyElectionResult,
    "type"
  >,
) {
  return {
    type: "ElectionProviderMultiPhase",
    value: { ...value, type: "setEmergencyElectionResult" },
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
  value: Omit<types.pallet_election_provider_multi_phase.pallet.Call.submit, "type">,
) {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "submit" } }
}

/**
 * Trigger the governance fallback.
 *
 * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
 * calling [`Call::set_emergency_election_result`].
 */
export function governanceFallback(
  value: Omit<types.pallet_election_provider_multi_phase.pallet.Call.governanceFallback, "type">,
) {
  return { type: "ElectionProviderMultiPhase", value: { ...value, type: "governanceFallback" } }
}

/** Duration of the unsigned phase. */
export const UnsignedPhase: types.u32 = codecs.$4.decode(C.hex.decode("58020000" as C.Hex))

/** Duration of the signed phase. */
export const SignedPhase: types.u32 = codecs.$4.decode(C.hex.decode("58020000" as C.Hex))

/**
 *  The minimum amount of improvement to the solution score that defines a solution as
 *  "better" in the Signed phase.
 */
export const BetterSignedThreshold: types.sp_arithmetic.per_things.Perbill = codecs.$42.decode(
  C.hex.decode("00000000" as C.Hex),
)

/**
 *  The minimum amount of improvement to the solution score that defines a solution as
 *  "better" in the Unsigned phase.
 */
export const BetterUnsignedThreshold: types.sp_arithmetic.per_things.Perbill = codecs.$42.decode(
  C.hex.decode("20a10700" as C.Hex),
)

/**
 *  The repeat threshold of the offchain worker.
 *
 *  For example, if it is 5, that means that at least 5 blocks will elapse between attempts
 *  to submit the worker's solution.
 */
export const OffchainRepeat: types.u32 = codecs.$4.decode(C.hex.decode("12000000" as C.Hex))

/** The priority of the unsigned transaction submitted in the unsigned-phase */
export const MinerTxPriority: types.u64 = codecs.$9.decode(
  C.hex.decode("65666666666666e6" as C.Hex),
)

/**
 *  Maximum number of signed submissions that can be queued.
 *
 *  It is best to avoid adjusting this during an election, as it impacts downstream data
 *  structures. In particular, `SignedSubmissionIndices<T>` is bounded on this value. If you
 *  update this value during an election, you _must_ ensure that
 *  `SignedSubmissionIndices.len()` is less than or equal to the new value. Otherwise,
 *  attempts to submit new solutions may cause a runtime panic.
 */
export const SignedMaxSubmissions: types.u32 = codecs.$4.decode(C.hex.decode("10000000" as C.Hex))

/**
 *  Maximum weight of a signed solution.
 *
 *  If [`Config::MinerConfig`] is being implemented to submit signed solutions (outside of
 *  this pallet), then [`MinerConfig::solution_weight`] is used to compare against
 *  this value.
 */
export const SignedMaxWeight: types.frame_support.weights.weight_v2.Weight = codecs.$8.decode(
  C.hex.decode("68151d3557010000" as C.Hex),
)

/** The maximum amount of unchecked solutions to refund the call fee for. */
export const SignedMaxRefunds: types.u32 = codecs.$4.decode(C.hex.decode("04000000" as C.Hex))

/** Base reward for a signed solution */
export const SignedRewardBase: types.u128 = codecs.$6.decode(
  C.hex.decode("00e40b54020000000000000000000000" as C.Hex),
)

/** Base deposit for a signed solution. */
export const SignedDepositBase: types.u128 = codecs.$6.decode(
  C.hex.decode("00a0db215d0000000000000000000000" as C.Hex),
)

/** Per-byte deposit for a signed solution. */
export const SignedDepositByte: types.u128 = codecs.$6.decode(
  C.hex.decode("787d0100000000000000000000000000" as C.Hex),
)

/** Per-weight deposit for a signed solution. */
export const SignedDepositWeight: types.u128 = codecs.$6.decode(
  C.hex.decode("00000000000000000000000000000000" as C.Hex),
)

/**
 *  The maximum number of electing voters to put in the snapshot. At the moment, snapshots
 *  are only over a single block, but once multi-block elections are introduced they will
 *  take place over multiple blocks.
 */
export const MaxElectingVoters: types.u32 = codecs.$4.decode(C.hex.decode("e4570000" as C.Hex))

/** The maximum number of electable targets to put in the snapshot. */
export const MaxElectableTargets: types.u16 = codecs.$81.decode(C.hex.decode("ffff" as C.Hex))
