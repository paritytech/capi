import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_grandpa.pallet.Call> = codecs.$216
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_grandpa.pallet.Call.reportEquivocation
  | types.pallet_grandpa.pallet.Call.reportEquivocationUnsigned
  | types.pallet_grandpa.pallet.Call.noteStalled
export namespace Call {
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   */
  export interface reportEquivocation {
    type: "reportEquivocation"
    equivocationProof: types.sp_finality_grandpa.EquivocationProof
    keyOwnerProof: types.sp_session.MembershipProof
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
  export interface reportEquivocationUnsigned {
    type: "reportEquivocationUnsigned"
    equivocationProof: types.sp_finality_grandpa.EquivocationProof
    keyOwnerProof: types.sp_session.MembershipProof
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
  export interface noteStalled {
    type: "noteStalled"
    delay: types.u32
    bestFinalizedBlockNumber: types.u32
  }
  /**
   * Report voter equivocation/misbehavior. This method will verify the
   * equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence
   * will be reported.
   */
  export function reportEquivocation(
    value: Omit<types.pallet_grandpa.pallet.Call.reportEquivocation, "type">,
  ): types.pallet_grandpa.pallet.Call.reportEquivocation {
    return { type: "reportEquivocation", ...value }
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
  export function reportEquivocationUnsigned(
    value: Omit<types.pallet_grandpa.pallet.Call.reportEquivocationUnsigned, "type">,
  ): types.pallet_grandpa.pallet.Call.reportEquivocationUnsigned {
    return { type: "reportEquivocationUnsigned", ...value }
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
  export function noteStalled(
    value: Omit<types.pallet_grandpa.pallet.Call.noteStalled, "type">,
  ): types.pallet_grandpa.pallet.Call.noteStalled {
    return { type: "noteStalled", ...value }
  }
}

export const $error: $.Codec<types.pallet_grandpa.pallet.Error> = codecs.$515
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "PauseFailed"
  | "ResumeFailed"
  | "ChangePending"
  | "TooSoon"
  | "InvalidKeyOwnershipProof"
  | "InvalidEquivocationProof"
  | "DuplicateOffenceReport"

export const $event: $.Codec<types.pallet_grandpa.pallet.Event> = codecs.$47
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_grandpa.pallet.Event.NewAuthorities
  | types.pallet_grandpa.pallet.Event.Paused
  | types.pallet_grandpa.pallet.Event.Resumed
export namespace Event {
  /** New authority set has been applied. */
  export interface NewAuthorities {
    type: "NewAuthorities"
    authoritySet: Array<[types.sp_finality_grandpa.app.Public, types.u64]>
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
