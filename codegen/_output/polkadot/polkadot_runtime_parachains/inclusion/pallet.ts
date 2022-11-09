import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $call: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Call> = _codec.$377

export const $error: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Error> = _codec.$646

export const $event: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Event> = _codec.$95

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
  | t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked
  | t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded
  | t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut
export namespace Event {
  /** A candidate was backed. `[candidate, head_data]` */
  export interface CandidateBacked {
    type: "CandidateBacked"
    value: [
      t.polkadot_primitives.v2.CandidateReceipt,
      t.polkadot_parachain.primitives.HeadData,
      t.polkadot_primitives.v2.CoreIndex,
      t.polkadot_primitives.v2.GroupIndex,
    ]
  }
  /** A candidate was included. `[candidate, head_data]` */
  export interface CandidateIncluded {
    type: "CandidateIncluded"
    value: [
      t.polkadot_primitives.v2.CandidateReceipt,
      t.polkadot_parachain.primitives.HeadData,
      t.polkadot_primitives.v2.CoreIndex,
      t.polkadot_primitives.v2.GroupIndex,
    ]
  }
  /** A candidate timed out. `[candidate, head_data]` */
  export interface CandidateTimedOut {
    type: "CandidateTimedOut"
    value: [
      t.polkadot_primitives.v2.CandidateReceipt,
      t.polkadot_parachain.primitives.HeadData,
      t.polkadot_primitives.v2.CoreIndex,
    ]
  }
  /** A candidate was backed. `[candidate, head_data]` */
  export function CandidateBacked(
    ...value: t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked["value"]
  ): t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateBacked {
    return { type: "CandidateBacked", value }
  }
  /** A candidate was included. `[candidate, head_data]` */
  export function CandidateIncluded(
    ...value: t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded["value"]
  ): t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateIncluded {
    return { type: "CandidateIncluded", value }
  }
  /** A candidate timed out. `[candidate, head_data]` */
  export function CandidateTimedOut(
    ...value: t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut["value"]
  ): t.polkadot_runtime_parachains.inclusion.pallet.Event.CandidateTimedOut {
    return { type: "CandidateTimedOut", value }
  }
}
