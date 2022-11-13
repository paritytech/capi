import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $call: $.Codec<types.pallet_grandpa.pallet.Call> = _codec.$216

export const $error: $.Codec<types.pallet_grandpa.pallet.Error> = _codec.$519

export const $event: $.Codec<types.pallet_grandpa.pallet.Event> = _codec.$47

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | types.pallet_grandpa.pallet.Call.report_equivocation
  | types.pallet_grandpa.pallet.Call.report_equivocation_unsigned
  | types.pallet_grandpa.pallet.Call.note_stalled
export namespace Call {
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   */
  export interface report_equivocation {
    type: "report_equivocation"
    equivocation_proof: types.sp_finality_grandpa.EquivocationProof
    key_owner_proof: types.sp_session.MembershipProof
  }
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   *
   * This extrinsic must be called unsigned and it is expected that only
   * block authors will call it (validated in `ValidateUnsigned`), as such
   * if the block author is defined it will be defined as the equivocation
   * reporter.
   */
  export interface report_equivocation_unsigned {
    type: "report_equivocation_unsigned"
    equivocation_proof: types.sp_finality_grandpa.EquivocationProof
    key_owner_proof: types.sp_session.MembershipProof
  }
  /**
   * Note that the current authority set of the GRANDPA finality gadget has stalled.
   *
   * This will trigger a forced authority set change at the beginning of the next session, to
   * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
   * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
   * The block production rate (which may be slowed down because of finality lagging) should
   * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
   * authority will start voting on top of `best_finalized_block_number` for new finalized
   * blocks. `best_finalized_block_number` should be the highest of the latest finalized
   * block of all validators of the new authority set.
   *
   * Only callable by root.
   */
  export interface note_stalled {
    type: "note_stalled"
    delay: types.u32
    best_finalized_block_number: types.u32
  }
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   */
  export function report_equivocation(
    value: Omit<types.pallet_grandpa.pallet.Call.report_equivocation, "type">,
  ): types.pallet_grandpa.pallet.Call.report_equivocation {
    return { type: "report_equivocation", ...value }
  }
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   *
   * This extrinsic must be called unsigned and it is expected that only
   * block authors will call it (validated in `ValidateUnsigned`), as such
   * if the block author is defined it will be defined as the equivocation
   * reporter.
   */
  export function report_equivocation_unsigned(
    value: Omit<types.pallet_grandpa.pallet.Call.report_equivocation_unsigned, "type">,
  ): types.pallet_grandpa.pallet.Call.report_equivocation_unsigned {
    return { type: "report_equivocation_unsigned", ...value }
  }
  /**
   * Note that the current authority set of the GRANDPA finality gadget has stalled.
   *
   * This will trigger a forced authority set change at the beginning of the next session, to
   * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
   * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
   * The block production rate (which may be slowed down because of finality lagging) should
   * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
   * authority will start voting on top of `best_finalized_block_number` for new finalized
   * blocks. `best_finalized_block_number` should be the highest of the latest finalized
   * block of all validators of the new authority set.
   *
   * Only callable by root.
   */
  export function note_stalled(
    value: Omit<types.pallet_grandpa.pallet.Call.note_stalled, "type">,
  ): types.pallet_grandpa.pallet.Call.note_stalled {
    return { type: "note_stalled", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "PauseFailed"
  | "ResumeFailed"
  | "ChangePending"
  | "TooSoon"
  | "InvalidKeyOwnershipProof"
  | "InvalidEquivocationProof"
  | "DuplicateOffenceReport"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | types.pallet_grandpa.pallet.Event.NewAuthorities
  | types.pallet_grandpa.pallet.Event.Paused
  | types.pallet_grandpa.pallet.Event.Resumed
export namespace Event {
  /** New authority set has been applied. */
  export interface NewAuthorities {
    type: "NewAuthorities"
    authority_set: Array<[types.sp_finality_grandpa.app.Public, types.u64]>
  }
  /** Current authority set has been paused. */
  export interface Paused {
    type: "Paused"
  }
  /** Current authority set has been resumed. */
  export interface Resumed {
    type: "Resumed"
  }
  /** New authority set has been applied. */
  export function NewAuthorities(
    value: Omit<types.pallet_grandpa.pallet.Event.NewAuthorities, "type">,
  ): types.pallet_grandpa.pallet.Event.NewAuthorities {
    return { type: "NewAuthorities", ...value }
  }
  /** Current authority set has been paused. */
  export function Paused(): types.pallet_grandpa.pallet.Event.Paused {
    return { type: "Paused" }
  }
  /** Current authority set has been resumed. */
  export function Resumed(): types.pallet_grandpa.pallet.Event.Resumed {
    return { type: "Resumed" }
  }
}
