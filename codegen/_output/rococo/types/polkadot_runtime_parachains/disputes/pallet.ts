import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $call: $.Codec<t.types.polkadot_runtime_parachains.disputes.pallet.Call> = _codec.$410

export const $error: $.Codec<t.types.polkadot_runtime_parachains.disputes.pallet.Error> =
  _codec.$700

export const $event: $.Codec<t.types.polkadot_runtime_parachains.disputes.pallet.Event> =
  _codec.$113

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = "force_unfreeze"

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "DuplicateDisputeStatementSets"
  | "AncientDisputeStatement"
  | "ValidatorIndexOutOfBounds"
  | "InvalidSignature"
  | "DuplicateStatement"
  | "PotentialSpam"
  | "SingleSidedDispute"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated
  | t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded
  | t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut
  | t.types.polkadot_runtime_parachains.disputes.pallet.Event.Revert
export namespace Event {
  /** A dispute has been initiated. \[candidate hash, dispute location\] */
  export interface DisputeInitiated {
    type: "DisputeInitiated"
    value: [
      t.types.polkadot_core_primitives.CandidateHash,
      t.types.polkadot_runtime_parachains.disputes.DisputeLocation,
    ]
  }
  /**
   * A dispute has concluded for or against a candidate.
   * `\[para id, candidate hash, dispute result\]`
   */
  export interface DisputeConcluded {
    type: "DisputeConcluded"
    value: [
      t.types.polkadot_core_primitives.CandidateHash,
      t.types.polkadot_runtime_parachains.disputes.DisputeResult,
    ]
  }
  /**
   * A dispute has timed out due to insufficient participation.
   * `\[para id, candidate hash\]`
   */
  export interface DisputeTimedOut {
    type: "DisputeTimedOut"
    value: t.types.polkadot_core_primitives.CandidateHash
  }
  /**
   * A dispute has concluded with supermajority against a candidate.
   * Block authors should no longer build on top of this head and should
   * instead revert the block at the given height. This should be the
   * number of the child of the last known valid block in the chain.
   */
  export interface Revert {
    type: "Revert"
    value: t.types.u32
  }
  /** A dispute has been initiated. \[candidate hash, dispute location\] */
  export function DisputeInitiated(
    ...value: t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated["value"]
  ): t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated {
    return { type: "DisputeInitiated", value }
  }
  /**
   * A dispute has concluded for or against a candidate.
   * `\[para id, candidate hash, dispute result\]`
   */
  export function DisputeConcluded(
    ...value: t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded["value"]
  ): t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded {
    return { type: "DisputeConcluded", value }
  }
  /**
   * A dispute has timed out due to insufficient participation.
   * `\[para id, candidate hash\]`
   */
  export function DisputeTimedOut(
    value: t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut["value"],
  ): t.types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut {
    return { type: "DisputeTimedOut", value }
  }
  /**
   * A dispute has concluded with supermajority against a candidate.
   * Block authors should no longer build on top of this head and should
   * instead revert the block at the given height. This should be the
   * number of the child of the last known valid block in the chain.
   */
  export function Revert(
    value: t.types.polkadot_runtime_parachains.disputes.pallet.Event.Revert["value"],
  ): t.types.polkadot_runtime_parachains.disputes.pallet.Event.Revert {
    return { type: "Revert", value }
  }
}
