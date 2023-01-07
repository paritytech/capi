import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as assignment_app from "./assignment_app.ts"
export * as collator_app from "./collator_app.ts"
export * as signed from "./signed.ts"
export * as validator_app from "./validator_app.ts"

export const $availabilityBitfield: $.Codec<types.polkadot_primitives.v2.AvailabilityBitfield> =
  codecs.$381
export type AvailabilityBitfield = $.BitSequence

export function AvailabilityBitfield(value: types.polkadot_primitives.v2.AvailabilityBitfield) {
  return value
}

export const $backedCandidate: $.Codec<types.polkadot_primitives.v2.BackedCandidate> = codecs.$387
export interface BackedCandidate {
  candidate: types.polkadot_primitives.v2.CommittedCandidateReceipt
  validityVotes: Array<types.polkadot_primitives.v2.ValidityAttestation>
  validatorIndices: $.BitSequence
}

export function BackedCandidate(value: types.polkadot_primitives.v2.BackedCandidate) {
  return value
}

export const $candidateCommitments: $.Codec<types.polkadot_primitives.v2.CandidateCommitments> =
  codecs.$389
export interface CandidateCommitments {
  upwardMessages: Array<Uint8Array>
  horizontalMessages: Array<types.polkadot_core_primitives.OutboundHrmpMessage>
  newValidationCode: types.polkadot_parachain.primitives.ValidationCode | undefined
  headData: types.polkadot_parachain.primitives.HeadData
  processedDownwardMessages: types.u32
  hrmpWatermark: types.u32
}

export function CandidateCommitments(value: types.polkadot_primitives.v2.CandidateCommitments) {
  return value
}

export const $candidateDescriptor: $.Codec<types.polkadot_primitives.v2.CandidateDescriptor> =
  codecs.$96
export interface CandidateDescriptor {
  paraId: types.polkadot_parachain.primitives.Id
  relayParent: types.primitive_types.H256
  collator: types.polkadot_primitives.v2.collator_app.Public
  persistedValidationDataHash: types.primitive_types.H256
  povHash: types.primitive_types.H256
  erasureRoot: types.primitive_types.H256
  signature: types.polkadot_primitives.v2.collator_app.Signature
  paraHead: types.primitive_types.H256
  validationCodeHash: types.polkadot_parachain.primitives.ValidationCodeHash
}

export function CandidateDescriptor(value: types.polkadot_primitives.v2.CandidateDescriptor) {
  return value
}

export const $candidateReceipt: $.Codec<types.polkadot_primitives.v2.CandidateReceipt> = codecs.$95
export interface CandidateReceipt {
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  commitmentsHash: types.primitive_types.H256
}

export function CandidateReceipt(value: types.polkadot_primitives.v2.CandidateReceipt) {
  return value
}

export const $committedCandidateReceipt: $.Codec<
  types.polkadot_primitives.v2.CommittedCandidateReceipt
> = codecs.$388
export interface CommittedCandidateReceipt {
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  commitments: types.polkadot_primitives.v2.CandidateCommitments
}

export function CommittedCandidateReceipt(
  value: types.polkadot_primitives.v2.CommittedCandidateReceipt,
) {
  return value
}

export const $coreIndex: $.Codec<types.polkadot_primitives.v2.CoreIndex> = codecs.$104
export type CoreIndex = types.u32

export function CoreIndex(value: types.polkadot_primitives.v2.CoreIndex) {
  return value
}

export const $coreOccupied: $.Codec<types.polkadot_primitives.v2.CoreOccupied> = codecs.$653
export type CoreOccupied =
  | types.polkadot_primitives.v2.CoreOccupied.Parathread
  | types.polkadot_primitives.v2.CoreOccupied.Parachain
export namespace CoreOccupied {
  export interface Parathread {
    type: "Parathread"
    value: types.polkadot_primitives.v2.ParathreadEntry
  }
  export interface Parachain {
    type: "Parachain"
  }
  export function Parathread(
    value: types.polkadot_primitives.v2.CoreOccupied.Parathread["value"],
  ): types.polkadot_primitives.v2.CoreOccupied.Parathread {
    return { type: "Parathread", value }
  }
  export function Parachain(): types.polkadot_primitives.v2.CoreOccupied.Parachain {
    return { type: "Parachain" }
  }
}

export const $disputeState: $.Codec<types.polkadot_primitives.v2.DisputeState> = codecs.$691
export interface DisputeState {
  validatorsFor: $.BitSequence
  validatorsAgainst: $.BitSequence
  start: types.u32
  concludedAt: types.u32 | undefined
}

export function DisputeState(value: types.polkadot_primitives.v2.DisputeState) {
  return value
}

export const $disputeStatement: $.Codec<types.polkadot_primitives.v2.DisputeStatement> = codecs.$400
export type DisputeStatement =
  | types.polkadot_primitives.v2.DisputeStatement.Valid
  | types.polkadot_primitives.v2.DisputeStatement.Invalid
export namespace DisputeStatement {
  export interface Valid {
    type: "Valid"
    value: types.polkadot_primitives.v2.ValidDisputeStatementKind
  }
  export interface Invalid {
    type: "Invalid"
    value: types.polkadot_primitives.v2.InvalidDisputeStatementKind
  }
  export function Valid(
    value: types.polkadot_primitives.v2.DisputeStatement.Valid["value"],
  ): types.polkadot_primitives.v2.DisputeStatement.Valid {
    return { type: "Valid", value }
  }
  export function Invalid(
    value: types.polkadot_primitives.v2.DisputeStatement.Invalid["value"],
  ): types.polkadot_primitives.v2.DisputeStatement.Invalid {
    return { type: "Invalid", value }
  }
}

export const $disputeStatementSet: $.Codec<types.polkadot_primitives.v2.DisputeStatementSet> =
  codecs.$397
export interface DisputeStatementSet {
  candidateHash: types.polkadot_core_primitives.CandidateHash
  session: types.u32
  statements: Array<
    [
      types.polkadot_primitives.v2.DisputeStatement,
      types.polkadot_primitives.v2.ValidatorIndex,
      types.polkadot_primitives.v2.validator_app.Signature,
    ]
  >
}

export function DisputeStatementSet(value: types.polkadot_primitives.v2.DisputeStatementSet) {
  return value
}

export const $groupIndex: $.Codec<types.polkadot_primitives.v2.GroupIndex> = codecs.$105
export type GroupIndex = types.u32

export function GroupIndex(value: types.polkadot_primitives.v2.GroupIndex) {
  return value
}

export const $inherentData: $.Codec<types.polkadot_primitives.v2.InherentData> = codecs.$378
export interface InherentData {
  bitfields: Array<types.polkadot_primitives.v2.signed.UncheckedSigned>
  backedCandidates: Array<types.polkadot_primitives.v2.BackedCandidate>
  disputes: Array<types.polkadot_primitives.v2.DisputeStatementSet>
  parentHeader: types.sp_runtime.generic.header.Header
}

export function InherentData(value: types.polkadot_primitives.v2.InherentData) {
  return value
}

export const $invalidDisputeStatementKind: $.Codec<
  types.polkadot_primitives.v2.InvalidDisputeStatementKind
> = codecs.$402
export type InvalidDisputeStatementKind = "Explicit"

export const $parathreadClaim: $.Codec<types.polkadot_primitives.v2.ParathreadClaim> = codecs.$650
export type ParathreadClaim = [
  types.polkadot_parachain.primitives.Id,
  types.polkadot_primitives.v2.collator_app.Public,
]

export function ParathreadClaim(...value: types.polkadot_primitives.v2.ParathreadClaim) {
  return value
}

export const $parathreadEntry: $.Codec<types.polkadot_primitives.v2.ParathreadEntry> = codecs.$649
export interface ParathreadEntry {
  claim: types.polkadot_primitives.v2.ParathreadClaim
  retries: types.u32
}

export function ParathreadEntry(value: types.polkadot_primitives.v2.ParathreadEntry) {
  return value
}

export const $pvfCheckStatement: $.Codec<types.polkadot_primitives.v2.PvfCheckStatement> =
  codecs.$404
export interface PvfCheckStatement {
  accept: boolean
  subject: types.polkadot_parachain.primitives.ValidationCodeHash
  sessionIndex: types.u32
  validatorIndex: types.polkadot_primitives.v2.ValidatorIndex
}

export function PvfCheckStatement(value: types.polkadot_primitives.v2.PvfCheckStatement) {
  return value
}

export const $scrapedOnChainVotes: $.Codec<types.polkadot_primitives.v2.ScrapedOnChainVotes> =
  codecs.$639
export interface ScrapedOnChainVotes {
  session: types.u32
  backingValidatorsPerCandidate: Array<
    [
      types.polkadot_primitives.v2.CandidateReceipt,
      Array<
        [
          types.polkadot_primitives.v2.ValidatorIndex,
          types.polkadot_primitives.v2.ValidityAttestation,
        ]
      >,
    ]
  >
  disputes: Array<types.polkadot_primitives.v2.DisputeStatementSet>
}

export function ScrapedOnChainVotes(value: types.polkadot_primitives.v2.ScrapedOnChainVotes) {
  return value
}

export const $sessionInfo: $.Codec<types.polkadot_primitives.v2.SessionInfo> = codecs.$688
export interface SessionInfo {
  activeValidatorIndices: Array<types.polkadot_primitives.v2.ValidatorIndex>
  randomSeed: Uint8Array
  disputePeriod: types.u32
  validators: Array<types.polkadot_primitives.v2.validator_app.Public>
  discoveryKeys: Array<types.sp_authority_discovery.app.Public>
  assignmentKeys: Array<types.polkadot_primitives.v2.assignment_app.Public>
  validatorGroups: Array<Array<types.polkadot_primitives.v2.ValidatorIndex>>
  nCores: types.u32
  zerothDelayTrancheWidth: types.u32
  relayVrfModuloSamples: types.u32
  nDelayTranches: types.u32
  noShowSlots: types.u32
  neededApprovals: types.u32
}

export function SessionInfo(value: types.polkadot_primitives.v2.SessionInfo) {
  return value
}

export const $upgradeGoAhead: $.Codec<types.polkadot_primitives.v2.UpgradeGoAhead> = codecs.$668
export type UpgradeGoAhead = "Abort" | "GoAhead"

export const $upgradeRestriction: $.Codec<types.polkadot_primitives.v2.UpgradeRestriction> =
  codecs.$669
export type UpgradeRestriction = "Present"

export const $validDisputeStatementKind: $.Codec<
  types.polkadot_primitives.v2.ValidDisputeStatementKind
> = codecs.$401
export type ValidDisputeStatementKind =
  | types.polkadot_primitives.v2.ValidDisputeStatementKind.Explicit
  | types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded
  | types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid
  | types.polkadot_primitives.v2.ValidDisputeStatementKind.ApprovalChecking
export namespace ValidDisputeStatementKind {
  export interface Explicit {
    type: "Explicit"
  }
  export interface BackingSeconded {
    type: "BackingSeconded"
    value: types.primitive_types.H256
  }
  export interface BackingValid {
    type: "BackingValid"
    value: types.primitive_types.H256
  }
  export interface ApprovalChecking {
    type: "ApprovalChecking"
  }
  export function Explicit(): types.polkadot_primitives.v2.ValidDisputeStatementKind.Explicit {
    return { type: "Explicit" }
  }
  export function BackingSeconded(
    value: types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded["value"],
  ): types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded {
    return { type: "BackingSeconded", value }
  }
  export function BackingValid(
    value: types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid["value"],
  ): types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid {
    return { type: "BackingValid", value }
  }
  export function ApprovalChecking(): types.polkadot_primitives.v2.ValidDisputeStatementKind.ApprovalChecking {
    return { type: "ApprovalChecking" }
  }
}

export const $validatorIndex: $.Codec<types.polkadot_primitives.v2.ValidatorIndex> = codecs.$384
export type ValidatorIndex = types.u32

export function ValidatorIndex(value: types.polkadot_primitives.v2.ValidatorIndex) {
  return value
}

export const $validityAttestation: $.Codec<types.polkadot_primitives.v2.ValidityAttestation> =
  codecs.$395
export type ValidityAttestation =
  | types.polkadot_primitives.v2.ValidityAttestation.Implicit
  | types.polkadot_primitives.v2.ValidityAttestation.Explicit
export namespace ValidityAttestation {
  export interface Implicit {
    type: "Implicit"
    value: types.polkadot_primitives.v2.validator_app.Signature
  }
  export interface Explicit {
    type: "Explicit"
    value: types.polkadot_primitives.v2.validator_app.Signature
  }
  export function Implicit(
    value: types.polkadot_primitives.v2.ValidityAttestation.Implicit["value"],
  ): types.polkadot_primitives.v2.ValidityAttestation.Implicit {
    return { type: "Implicit", value }
  }
  export function Explicit(
    value: types.polkadot_primitives.v2.ValidityAttestation.Explicit["value"],
  ): types.polkadot_primitives.v2.ValidityAttestation.Explicit {
    return { type: "Explicit", value }
  }
}
