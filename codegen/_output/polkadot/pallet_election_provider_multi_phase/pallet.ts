import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_election_provider_multi_phase.pallet.Call> = _codec.$310

export const $error: $.Codec<t.pallet_election_provider_multi_phase.pallet.Error> = _codec.$611

export const $event: $.Codec<t.pallet_election_provider_multi_phase.pallet.Event> = _codec.$86

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_election_provider_multi_phase.pallet.Call.submit_unsigned
  | t.pallet_election_provider_multi_phase.pallet.Call.set_minimum_untrusted_score
  | t.pallet_election_provider_multi_phase.pallet.Call.set_emergency_election_result
  | t.pallet_election_provider_multi_phase.pallet.Call.submit
  | t.pallet_election_provider_multi_phase.pallet.Call.governance_fallback
export namespace Call {
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
  export interface submit_unsigned {
    type: "submit_unsigned"
    raw_solution: t.pallet_election_provider_multi_phase.RawSolution
    witness: t.pallet_election_provider_multi_phase.SolutionOrSnapshotSize
  }
  /**
   * Set a new value for `MinimumUntrustedScore`.
   *
   * Dispatch origin must be aligned with `T::ForceOrigin`.
   *
   * This check can be turned off by setting the value to `None`.
   */
  export interface set_minimum_untrusted_score {
    type: "set_minimum_untrusted_score"
    maybe_next_score: t.sp_npos_elections.ElectionScore | undefined
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
  export interface set_emergency_election_result {
    type: "set_emergency_election_result"
    supports: Array<[t.sp_core.crypto.AccountId32, t.sp_npos_elections.Support]>
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
  export interface submit {
    type: "submit"
    raw_solution: t.pallet_election_provider_multi_phase.RawSolution
  }
  /**
   * Trigger the governance fallback.
   *
   * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
   * calling [`Call::set_emergency_election_result`].
   */
  export interface governance_fallback {
    type: "governance_fallback"
    maybe_max_voters: t.u32 | undefined
    maybe_max_targets: t.u32 | undefined
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
  ): t.pallet_election_provider_multi_phase.pallet.Call.submit_unsigned {
    return { type: "submit_unsigned", ...value }
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
  ): t.pallet_election_provider_multi_phase.pallet.Call.set_minimum_untrusted_score {
    return { type: "set_minimum_untrusted_score", ...value }
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
  ): t.pallet_election_provider_multi_phase.pallet.Call.set_emergency_election_result {
    return { type: "set_emergency_election_result", ...value }
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
  ): t.pallet_election_provider_multi_phase.pallet.Call.submit {
    return { type: "submit", ...value }
  }
  /**
   * Trigger the governance fallback.
   *
   * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
   * calling [`Call::set_emergency_election_result`].
   */
  export function governance_fallback(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Call.governance_fallback, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Call.governance_fallback {
    return { type: "governance_fallback", ...value }
  }
}

/** Error of the pallet that can be returned in response to dispatches. */
export type Error =
  | "PreDispatchEarlySubmission"
  | "PreDispatchWrongWinnerCount"
  | "PreDispatchWeakSubmission"
  | "SignedQueueFull"
  | "SignedCannotPayDeposit"
  | "SignedInvalidWitness"
  | "SignedTooMuchWeight"
  | "OcwCallWrongEra"
  | "MissingSnapshotMetadata"
  | "InvalidSubmissionIndex"
  | "CallNotAllowed"
  | "FallbackFailed"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_election_provider_multi_phase.pallet.Event.SolutionStored
  | t.pallet_election_provider_multi_phase.pallet.Event.ElectionFinalized
  | t.pallet_election_provider_multi_phase.pallet.Event.ElectionFailed
  | t.pallet_election_provider_multi_phase.pallet.Event.Rewarded
  | t.pallet_election_provider_multi_phase.pallet.Event.Slashed
  | t.pallet_election_provider_multi_phase.pallet.Event.SignedPhaseStarted
  | t.pallet_election_provider_multi_phase.pallet.Event.UnsignedPhaseStarted
export namespace Event {
  /**
   * A solution was stored with the given compute.
   *
   * If the solution is signed, this means that it hasn't yet been processed. If the
   * solution is unsigned, this means that it has also been processed.
   *
   * The `bool` is `true` when a previous solution was ejected to make room for this one.
   */
  export interface SolutionStored {
    type: "SolutionStored"
    compute: t.pallet_election_provider_multi_phase.ElectionCompute
    prev_ejected: boolean
  }
  /** The election has been finalized, with the given computation and score. */
  export interface ElectionFinalized {
    type: "ElectionFinalized"
    compute: t.pallet_election_provider_multi_phase.ElectionCompute
    score: t.sp_npos_elections.ElectionScore
  }
  /**
   * An election failed.
   *
   * Not much can be said about which computes failed in the process.
   */
  export interface ElectionFailed {
    type: "ElectionFailed"
  }
  /** An account has been rewarded for their signed submission being finalized. */
  export interface Rewarded {
    type: "Rewarded"
    account: t.sp_core.crypto.AccountId32
    value: t.u128
  }
  /** An account has been slashed for submitting an invalid signed submission. */
  export interface Slashed {
    type: "Slashed"
    account: t.sp_core.crypto.AccountId32
    value: t.u128
  }
  /** The signed phase of the given round has started. */
  export interface SignedPhaseStarted {
    type: "SignedPhaseStarted"
    round: t.u32
  }
  /** The unsigned phase of the given round has started. */
  export interface UnsignedPhaseStarted {
    type: "UnsignedPhaseStarted"
    round: t.u32
  }
  /**
   * A solution was stored with the given compute.
   *
   * If the solution is signed, this means that it hasn't yet been processed. If the
   * solution is unsigned, this means that it has also been processed.
   *
   * The `bool` is `true` when a previous solution was ejected to make room for this one.
   */
  export function SolutionStored(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.SolutionStored, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.SolutionStored {
    return { type: "SolutionStored", ...value }
  }
  /** The election has been finalized, with the given computation and score. */
  export function ElectionFinalized(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.ElectionFinalized, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.ElectionFinalized {
    return { type: "ElectionFinalized", ...value }
  }
  /**
   * An election failed.
   *
   * Not much can be said about which computes failed in the process.
   */
  export function ElectionFailed(): t.pallet_election_provider_multi_phase.pallet.Event.ElectionFailed {
    return { type: "ElectionFailed" }
  }
  /** An account has been rewarded for their signed submission being finalized. */
  export function Rewarded(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.Rewarded, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.Rewarded {
    return { type: "Rewarded", ...value }
  }
  /** An account has been slashed for submitting an invalid signed submission. */
  export function Slashed(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.Slashed, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
  /** The signed phase of the given round has started. */
  export function SignedPhaseStarted(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.SignedPhaseStarted, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.SignedPhaseStarted {
    return { type: "SignedPhaseStarted", ...value }
  }
  /** The unsigned phase of the given round has started. */
  export function UnsignedPhaseStarted(
    value: Omit<t.pallet_election_provider_multi_phase.pallet.Event.UnsignedPhaseStarted, "type">,
  ): t.pallet_election_provider_multi_phase.pallet.Event.UnsignedPhaseStarted {
    return { type: "UnsignedPhaseStarted", ...value }
  }
}
