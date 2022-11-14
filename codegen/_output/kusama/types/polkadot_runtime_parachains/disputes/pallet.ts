import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

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
  | types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated
  | types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded
  | types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut
  | types.polkadot_runtime_parachains.disputes.pallet.Event.Revert
export namespace Event {
  /** A dispute has been initiated. \[candidate hash, dispute location\] */
  export interface DisputeInitiated {
    type: "DisputeInitiated"
    value: [
      types.polkadot_core_primitives.CandidateHash,
      types.polkadot_runtime_parachains.disputes.DisputeLocation,
    ]
  }
  /**
   * A dispute has concluded for or against a candidate.
   * `\[para id, candidate hash, dispute result\]`
   */
  export interface DisputeConcluded {
    type: "DisputeConcluded"
    value: [
      types.polkadot_core_primitives.CandidateHash,
      types.polkadot_runtime_parachains.disputes.DisputeResult,
    ]
  }
  /**
   * A dispute has timed out due to insufficient participation.
   * `\[para id, candidate hash\]`
   */
  export interface DisputeTimedOut {
    type: "DisputeTimedOut"
    value: types.polkadot_core_primitives.CandidateHash
  }
  /**
   * A dispute has concluded with supermajority against a candidate.
   * Block authors should no longer build on top of this head and should
   * instead revert the block at the given height. This should be the
   * number of the child of the last known valid block in the chain.
   */
  export interface Revert {
    type: "Revert"
    value: types.u32
  }
  /** A dispute has been initiated. \[candidate hash, dispute location\] */
  export function DisputeInitiated(
    ...value: types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated["value"]
  ): types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeInitiated {
    return { type: "DisputeInitiated", value }
  }
  /**
   * A dispute has concluded for or against a candidate.
   * `\[para id, candidate hash, dispute result\]`
   */
  export function DisputeConcluded(
    ...value: types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded["value"]
  ): types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeConcluded {
    return { type: "DisputeConcluded", value }
  }
  /**
   * A dispute has timed out due to insufficient participation.
   * `\[para id, candidate hash\]`
   */
  export function DisputeTimedOut(
    value: types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut["value"],
  ): types.polkadot_runtime_parachains.disputes.pallet.Event.DisputeTimedOut {
    return { type: "DisputeTimedOut", value }
  }
  /**
   * A dispute has concluded with supermajority against a candidate.
   * Block authors should no longer build on top of this head and should
   * instead revert the block at the given height. This should be the
   * number of the child of the last known valid block in the chain.
   */
  export function Revert(
    value: types.polkadot_runtime_parachains.disputes.pallet.Event.Revert["value"],
  ): types.polkadot_runtime_parachains.disputes.pallet.Event.Revert {
    return { type: "Revert", value }
  }
}
