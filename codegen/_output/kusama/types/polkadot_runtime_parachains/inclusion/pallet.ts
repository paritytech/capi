import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = never
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "UnsortedOrDuplicateValidatorIndices"
  | "UnsortedOrDuplicateDisputeStatementSet"
  | "UnsortedOrDuplicateBackedCandidates"
  | "UnexpectedRelayParent"
  | "WrongBitfieldSize"
  | "BitfieldAllZeros"
  | "BitfieldDuplicateOrUnordered"
  | "ValidatorIndexOutOfBounds"
  | "InvalidBitfieldSignature"
  | "UnscheduledCandidate"
  | "CandidateScheduledBeforeParaFree"
  | "WrongCollator"
  | "ScheduledOutOfOrder"
  | "HeadDataTooLarge"
  | "PrematureCodeUpgrade"
  | "NewCodeTooLarge"
  | "CandidateNotInParentContext"
  | "InvalidGroupIndex"
  | "InsufficientBacking"
  | "InvalidBacking"
  | "NotCollatorSigned"
  | "ValidationDataHashMismatch"
  | "IncorrectDownwardMessageHandling"
  | "InvalidUpwardMessages"
  | "HrmpWatermarkMishandling"
  | "InvalidOutboundHrmp"
  | "InvalidValidationCodeHash"
  | "ParaHeadMismatch"
  | "BitfieldReferencesFreedCore"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked
  | types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded
  | types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut
export namespace Event {
  /** A candidate was backed. `[candidate, head_data]` */
  export interface CandidateBacked {
    type: "CandidateBacked"
    value: [
      types.polkadot_primitives.v2.CandidateReceipt,
      types.polkadot_parachain.primitives.HeadData,
      types.polkadot_primitives.v2.CoreIndex,
      types.polkadot_primitives.v2.GroupIndex,
    ]
  }
  /** A candidate was included. `[candidate, head_data]` */
  export interface CandidateIncluded {
    type: "CandidateIncluded"
    value: [
      types.polkadot_primitives.v2.CandidateReceipt,
      types.polkadot_parachain.primitives.HeadData,
      types.polkadot_primitives.v2.CoreIndex,
      types.polkadot_primitives.v2.GroupIndex,
    ]
  }
  /** A candidate timed out. `[candidate, head_data]` */
  export interface CandidateTimedOut {
    type: "CandidateTimedOut"
    value: [
      types.polkadot_primitives.v2.CandidateReceipt,
      types.polkadot_parachain.primitives.HeadData,
      types.polkadot_primitives.v2.CoreIndex,
    ]
  }
  /** A candidate was backed. `[candidate, head_data]` */
  export function CandidateBacked(
    ...value: types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked["value"]
  ): types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked {
    return { type: "CandidateBacked", value }
  }
  /** A candidate was included. `[candidate, head_data]` */
  export function CandidateIncluded(
    ...value: types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded["value"]
  ): types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded {
    return { type: "CandidateIncluded", value }
  }
  /** A candidate timed out. `[candidate, head_data]` */
  export function CandidateTimedOut(
    ...value: types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut["value"]
  ): types.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut {
    return { type: "CandidateTimedOut", value }
  }
}
