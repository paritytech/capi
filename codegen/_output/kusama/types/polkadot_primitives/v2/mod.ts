import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as assignment_app from "./assignment_app.ts"
export * as collator_app from "./collator_app.ts"
export * as signed from "./signed.ts"
export * as validator_app from "./validator_app.ts"

export const $availabilityBitfield: $.Codec<types.polkadot_primitives.v2.AvailabilityBitfield> =
  _codec.$382

export const $backedCandidate: $.Codec<types.polkadot_primitives.v2.BackedCandidate> = _codec.$388

export const $candidateCommitments: $.Codec<types.polkadot_primitives.v2.CandidateCommitments> =
  _codec.$390

export const $candidateDescriptor: $.Codec<types.polkadot_primitives.v2.CandidateDescriptor> =
  _codec.$97

export const $candidateReceipt: $.Codec<types.polkadot_primitives.v2.CandidateReceipt> = _codec.$96

export const $committedCandidateReceipt: $.Codec<
  types.polkadot_primitives.v2.CommittedCandidateReceipt
> = _codec.$389

export const $coreIndex: $.Codec<types.polkadot_primitives.v2.CoreIndex> = _codec.$105

export const $coreOccupied: $.Codec<types.polkadot_primitives.v2.CoreOccupied> = _codec.$661

export const $disputeState: $.Codec<types.polkadot_primitives.v2.DisputeState> = _codec.$699

export const $disputeStatement: $.Codec<types.polkadot_primitives.v2.DisputeStatement> = _codec.$401

export const $disputeStatementSet: $.Codec<types.polkadot_primitives.v2.DisputeStatementSet> =
  _codec.$398

export const $groupIndex: $.Codec<types.polkadot_primitives.v2.GroupIndex> = _codec.$106

export const $inherentData: $.Codec<types.polkadot_primitives.v2.InherentData> = _codec.$379

export const $invalidDisputeStatementKind: $.Codec<
  types.polkadot_primitives.v2.InvalidDisputeStatementKind
> = _codec.$403

export const $parathreadClaim: $.Codec<types.polkadot_primitives.v2.ParathreadClaim> = _codec.$658

export const $parathreadEntry: $.Codec<types.polkadot_primitives.v2.ParathreadEntry> = _codec.$657

export const $pvfCheckStatement: $.Codec<types.polkadot_primitives.v2.PvfCheckStatement> =
  _codec.$405

export const $scrapedOnChainVotes: $.Codec<types.polkadot_primitives.v2.ScrapedOnChainVotes> =
  _codec.$647

export const $sessionInfo: $.Codec<types.polkadot_primitives.v2.SessionInfo> = _codec.$696

export const $upgradeGoAhead: $.Codec<types.polkadot_primitives.v2.UpgradeGoAhead> = _codec.$676

export const $upgradeRestriction: $.Codec<types.polkadot_primitives.v2.UpgradeRestriction> =
  _codec.$677

export const $validDisputeStatementKind: $.Codec<
  types.polkadot_primitives.v2.ValidDisputeStatementKind
> = _codec.$402

export const $validatorIndex: $.Codec<types.polkadot_primitives.v2.ValidatorIndex> = _codec.$385

export const $validityAttestation: $.Codec<types.polkadot_primitives.v2.ValidityAttestation> =
  _codec.$396

export type AvailabilityBitfield = $.BitSequence

export function AvailabilityBitfield(value: types.polkadot_primitives.v2.AvailabilityBitfield) {
  return value
}

export interface BackedCandidate {
  candidate: types.polkadot_primitives.v2.CommittedCandidateReceipt
  validity_votes: Array<types.polkadot_primitives.v2.ValidityAttestation>
  validator_indices: $.BitSequence
}

export function BackedCandidate(value: types.polkadot_primitives.v2.BackedCandidate) {
  return value
}

export interface CandidateCommitments {
  upward_messages: Array<Uint8Array>
  horizontal_messages: Array<types.polkadot_core_primitives.OutboundHrmpMessage>
  new_validation_code: types.polkadot_parachain.primitives.ValidationCode | undefined
  head_data: types.polkadot_parachain.primitives.HeadData
  processed_downward_messages: types.u32
  hrmp_watermark: types.u32
}

export function CandidateCommitments(value: types.polkadot_primitives.v2.CandidateCommitments) {
  return value
}

export interface CandidateDescriptor {
  para_id: types.polkadot_parachain.primitives.Id
  relay_parent: types.primitive_types.H256
  collator: types.polkadot_primitives.v2.collator_app.Public
  persisted_validation_data_hash: types.primitive_types.H256
  pov_hash: types.primitive_types.H256
  erasure_root: types.primitive_types.H256
  signature: types.polkadot_primitives.v2.collator_app.Signature
  para_head: types.primitive_types.H256
  validation_code_hash: types.polkadot_parachain.primitives.ValidationCodeHash
}

export function CandidateDescriptor(value: types.polkadot_primitives.v2.CandidateDescriptor) {
  return value
}

export interface CandidateReceipt {
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  commitments_hash: types.primitive_types.H256
}

export function CandidateReceipt(value: types.polkadot_primitives.v2.CandidateReceipt) {
  return value
}

export interface CommittedCandidateReceipt {
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  commitments: types.polkadot_primitives.v2.CandidateCommitments
}

export function CommittedCandidateReceipt(
  value: types.polkadot_primitives.v2.CommittedCandidateReceipt,
) {
  return value
}

export type CoreIndex = types.u32

export function CoreIndex(value: types.polkadot_primitives.v2.CoreIndex) {
  return value
}

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

export interface DisputeState {
  validators_for: $.BitSequence
  validators_against: $.BitSequence
  start: types.u32
  concluded_at: types.u32 | undefined
}

export function DisputeState(value: types.polkadot_primitives.v2.DisputeState) {
  return value
}

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

export interface DisputeStatementSet {
  candidate_hash: types.polkadot_core_primitives.CandidateHash
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

export type GroupIndex = types.u32

export function GroupIndex(value: types.polkadot_primitives.v2.GroupIndex) {
  return value
}

export interface InherentData {
  bitfields: Array<types.polkadot_primitives.v2.signed.UncheckedSigned>
  backed_candidates: Array<types.polkadot_primitives.v2.BackedCandidate>
  disputes: Array<types.polkadot_primitives.v2.DisputeStatementSet>
  parent_header: types.sp_runtime.generic.header.Header
}

export function InherentData(value: types.polkadot_primitives.v2.InherentData) {
  return value
}

export type InvalidDisputeStatementKind = "Explicit"

export type ParathreadClaim = [
  types.polkadot_parachain.primitives.Id,
  types.polkadot_primitives.v2.collator_app.Public,
]

export function ParathreadClaim(...value: types.polkadot_primitives.v2.ParathreadClaim) {
  return value
}

export interface ParathreadEntry {
  claim: types.polkadot_primitives.v2.ParathreadClaim
  retries: types.u32
}

export function ParathreadEntry(value: types.polkadot_primitives.v2.ParathreadEntry) {
  return value
}

export interface PvfCheckStatement {
  accept: boolean
  subject: types.polkadot_parachain.primitives.ValidationCodeHash
  session_index: types.u32
  validator_index: types.polkadot_primitives.v2.ValidatorIndex
}

export function PvfCheckStatement(value: types.polkadot_primitives.v2.PvfCheckStatement) {
  return value
}

export interface ScrapedOnChainVotes {
  session: types.u32
  backing_validators_per_candidate: Array<
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

export interface SessionInfo {
  active_validator_indices: Array<types.polkadot_primitives.v2.ValidatorIndex>
  random_seed: Uint8Array
  dispute_period: types.u32
  validators: Array<types.polkadot_primitives.v2.validator_app.Public>
  discovery_keys: Array<types.sp_authority_discovery.app.Public>
  assignment_keys: Array<types.polkadot_primitives.v2.assignment_app.Public>
  validator_groups: Array<Array<types.polkadot_primitives.v2.ValidatorIndex>>
  n_cores: types.u32
  zeroth_delay_tranche_width: types.u32
  relay_vrf_modulo_samples: types.u32
  n_delay_tranches: types.u32
  no_show_slots: types.u32
  needed_approvals: types.u32
}

export function SessionInfo(value: types.polkadot_primitives.v2.SessionInfo) {
  return value
}

export type UpgradeGoAhead = "Abort" | "GoAhead"

export type UpgradeRestriction = "Present"

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

export type ValidatorIndex = types.u32

export function ValidatorIndex(value: types.polkadot_primitives.v2.ValidatorIndex) {
  return value
}

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
