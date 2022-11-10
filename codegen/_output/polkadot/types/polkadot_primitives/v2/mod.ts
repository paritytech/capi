import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as assignment_app from "./assignment_app.ts"
export * as collator_app from "./collator_app.ts"
export * as signed from "./signed.ts"
export * as validator_app from "./validator_app.ts"

export const $availabilityBitfield: $.Codec<t.types.polkadot_primitives.v2.AvailabilityBitfield> =
  _codec.$382

export const $backedCandidate: $.Codec<t.types.polkadot_primitives.v2.BackedCandidate> = _codec.$388

export const $candidateCommitments: $.Codec<t.types.polkadot_primitives.v2.CandidateCommitments> =
  _codec.$390

export const $candidateDescriptor: $.Codec<t.types.polkadot_primitives.v2.CandidateDescriptor> =
  _codec.$97

export const $candidateReceipt: $.Codec<t.types.polkadot_primitives.v2.CandidateReceipt> =
  _codec.$96

export const $committedCandidateReceipt: $.Codec<
  t.types.polkadot_primitives.v2.CommittedCandidateReceipt
> = _codec.$389

export const $coreIndex: $.Codec<t.types.polkadot_primitives.v2.CoreIndex> = _codec.$105

export const $coreOccupied: $.Codec<t.types.polkadot_primitives.v2.CoreOccupied> = _codec.$661

export const $disputeState: $.Codec<t.types.polkadot_primitives.v2.DisputeState> = _codec.$699

export const $disputeStatement: $.Codec<t.types.polkadot_primitives.v2.DisputeStatement> =
  _codec.$401

export const $disputeStatementSet: $.Codec<t.types.polkadot_primitives.v2.DisputeStatementSet> =
  _codec.$398

export const $groupIndex: $.Codec<t.types.polkadot_primitives.v2.GroupIndex> = _codec.$106

export const $inherentData: $.Codec<t.types.polkadot_primitives.v2.InherentData> = _codec.$379

export const $invalidDisputeStatementKind: $.Codec<
  t.types.polkadot_primitives.v2.InvalidDisputeStatementKind
> = _codec.$403

export const $parathreadClaim: $.Codec<t.types.polkadot_primitives.v2.ParathreadClaim> = _codec.$658

export const $parathreadEntry: $.Codec<t.types.polkadot_primitives.v2.ParathreadEntry> = _codec.$657

export const $pvfCheckStatement: $.Codec<t.types.polkadot_primitives.v2.PvfCheckStatement> =
  _codec.$405

export const $scrapedOnChainVotes: $.Codec<t.types.polkadot_primitives.v2.ScrapedOnChainVotes> =
  _codec.$647

export const $sessionInfo: $.Codec<t.types.polkadot_primitives.v2.SessionInfo> = _codec.$696

export const $upgradeGoAhead: $.Codec<t.types.polkadot_primitives.v2.UpgradeGoAhead> = _codec.$676

export const $upgradeRestriction: $.Codec<t.types.polkadot_primitives.v2.UpgradeRestriction> =
  _codec.$677

export const $validDisputeStatementKind: $.Codec<
  t.types.polkadot_primitives.v2.ValidDisputeStatementKind
> = _codec.$402

export const $validatorIndex: $.Codec<t.types.polkadot_primitives.v2.ValidatorIndex> = _codec.$385

export const $validityAttestation: $.Codec<t.types.polkadot_primitives.v2.ValidityAttestation> =
  _codec.$396

export type AvailabilityBitfield = $.BitSequence

export function AvailabilityBitfield(value: t.types.polkadot_primitives.v2.AvailabilityBitfield) {
  return value
}

export interface BackedCandidate {
  candidate: t.types.polkadot_primitives.v2.CommittedCandidateReceipt
  validity_votes: Array<t.types.polkadot_primitives.v2.ValidityAttestation>
  validator_indices: $.BitSequence
}

export function BackedCandidate(value: t.types.polkadot_primitives.v2.BackedCandidate) {
  return value
}

export interface CandidateCommitments {
  upward_messages: Array<Uint8Array>
  horizontal_messages: Array<t.types.polkadot_core_primitives.OutboundHrmpMessage>
  new_validation_code: t.types.polkadot_parachain.primitives.ValidationCode | undefined
  head_data: t.types.polkadot_parachain.primitives.HeadData
  processed_downward_messages: t.types.u32
  hrmp_watermark: t.types.u32
}

export function CandidateCommitments(value: t.types.polkadot_primitives.v2.CandidateCommitments) {
  return value
}

export interface CandidateDescriptor {
  para_id: t.types.polkadot_parachain.primitives.Id
  relay_parent: t.types.primitive_types.H256
  collator: t.types.polkadot_primitives.v2.collator_app.Public
  persisted_validation_data_hash: t.types.primitive_types.H256
  pov_hash: t.types.primitive_types.H256
  erasure_root: t.types.primitive_types.H256
  signature: t.types.polkadot_primitives.v2.collator_app.Signature
  para_head: t.types.primitive_types.H256
  validation_code_hash: t.types.polkadot_parachain.primitives.ValidationCodeHash
}

export function CandidateDescriptor(value: t.types.polkadot_primitives.v2.CandidateDescriptor) {
  return value
}

export interface CandidateReceipt {
  descriptor: t.types.polkadot_primitives.v2.CandidateDescriptor
  commitments_hash: t.types.primitive_types.H256
}

export function CandidateReceipt(value: t.types.polkadot_primitives.v2.CandidateReceipt) {
  return value
}

export interface CommittedCandidateReceipt {
  descriptor: t.types.polkadot_primitives.v2.CandidateDescriptor
  commitments: t.types.polkadot_primitives.v2.CandidateCommitments
}

export function CommittedCandidateReceipt(
  value: t.types.polkadot_primitives.v2.CommittedCandidateReceipt,
) {
  return value
}

export type CoreIndex = t.types.u32

export function CoreIndex(value: t.types.polkadot_primitives.v2.CoreIndex) {
  return value
}

export type CoreOccupied =
  | t.types.polkadot_primitives.v2.CoreOccupied.Parathread
  | t.types.polkadot_primitives.v2.CoreOccupied.Parachain
export namespace CoreOccupied {
  export interface Parathread {
    type: "Parathread"
    value: t.types.polkadot_primitives.v2.ParathreadEntry
  }
  export interface Parachain {
    type: "Parachain"
  }
  export function Parathread(
    value: t.types.polkadot_primitives.v2.CoreOccupied.Parathread["value"],
  ): t.types.polkadot_primitives.v2.CoreOccupied.Parathread {
    return { type: "Parathread", value }
  }
  export function Parachain(): t.types.polkadot_primitives.v2.CoreOccupied.Parachain {
    return { type: "Parachain" }
  }
}

export interface DisputeState {
  validators_for: $.BitSequence
  validators_against: $.BitSequence
  start: t.types.u32
  concluded_at: t.types.u32 | undefined
}

export function DisputeState(value: t.types.polkadot_primitives.v2.DisputeState) {
  return value
}

export type DisputeStatement =
  | t.types.polkadot_primitives.v2.DisputeStatement.Valid
  | t.types.polkadot_primitives.v2.DisputeStatement.Invalid
export namespace DisputeStatement {
  export interface Valid {
    type: "Valid"
    value: t.types.polkadot_primitives.v2.ValidDisputeStatementKind
  }
  export interface Invalid {
    type: "Invalid"
    value: t.types.polkadot_primitives.v2.InvalidDisputeStatementKind
  }
  export function Valid(
    value: t.types.polkadot_primitives.v2.DisputeStatement.Valid["value"],
  ): t.types.polkadot_primitives.v2.DisputeStatement.Valid {
    return { type: "Valid", value }
  }
  export function Invalid(
    value: t.types.polkadot_primitives.v2.DisputeStatement.Invalid["value"],
  ): t.types.polkadot_primitives.v2.DisputeStatement.Invalid {
    return { type: "Invalid", value }
  }
}

export interface DisputeStatementSet {
  candidate_hash: t.types.polkadot_core_primitives.CandidateHash
  session: t.types.u32
  statements: Array<
    [
      t.types.polkadot_primitives.v2.DisputeStatement,
      t.types.polkadot_primitives.v2.ValidatorIndex,
      t.types.polkadot_primitives.v2.validator_app.Signature,
    ]
  >
}

export function DisputeStatementSet(value: t.types.polkadot_primitives.v2.DisputeStatementSet) {
  return value
}

export type GroupIndex = t.types.u32

export function GroupIndex(value: t.types.polkadot_primitives.v2.GroupIndex) {
  return value
}

export interface InherentData {
  bitfields: Array<t.types.polkadot_primitives.v2.signed.UncheckedSigned>
  backed_candidates: Array<t.types.polkadot_primitives.v2.BackedCandidate>
  disputes: Array<t.types.polkadot_primitives.v2.DisputeStatementSet>
  parent_header: t.types.sp_runtime.generic.header.Header
}

export function InherentData(value: t.types.polkadot_primitives.v2.InherentData) {
  return value
}

export type InvalidDisputeStatementKind = "Explicit"

export type ParathreadClaim = [
  t.types.polkadot_parachain.primitives.Id,
  t.types.polkadot_primitives.v2.collator_app.Public,
]

export function ParathreadClaim(...value: t.types.polkadot_primitives.v2.ParathreadClaim) {
  return value
}

export interface ParathreadEntry {
  claim: t.types.polkadot_primitives.v2.ParathreadClaim
  retries: t.types.u32
}

export function ParathreadEntry(value: t.types.polkadot_primitives.v2.ParathreadEntry) {
  return value
}

export interface PvfCheckStatement {
  accept: boolean
  subject: t.types.polkadot_parachain.primitives.ValidationCodeHash
  session_index: t.types.u32
  validator_index: t.types.polkadot_primitives.v2.ValidatorIndex
}

export function PvfCheckStatement(value: t.types.polkadot_primitives.v2.PvfCheckStatement) {
  return value
}

export interface ScrapedOnChainVotes {
  session: t.types.u32
  backing_validators_per_candidate: Array<
    [
      t.types.polkadot_primitives.v2.CandidateReceipt,
      Array<
        [
          t.types.polkadot_primitives.v2.ValidatorIndex,
          t.types.polkadot_primitives.v2.ValidityAttestation,
        ]
      >,
    ]
  >
  disputes: Array<t.types.polkadot_primitives.v2.DisputeStatementSet>
}

export function ScrapedOnChainVotes(value: t.types.polkadot_primitives.v2.ScrapedOnChainVotes) {
  return value
}

export interface SessionInfo {
  active_validator_indices: Array<t.types.polkadot_primitives.v2.ValidatorIndex>
  random_seed: Uint8Array
  dispute_period: t.types.u32
  validators: Array<t.types.polkadot_primitives.v2.validator_app.Public>
  discovery_keys: Array<t.types.sp_authority_discovery.app.Public>
  assignment_keys: Array<t.types.polkadot_primitives.v2.assignment_app.Public>
  validator_groups: Array<Array<t.types.polkadot_primitives.v2.ValidatorIndex>>
  n_cores: t.types.u32
  zeroth_delay_tranche_width: t.types.u32
  relay_vrf_modulo_samples: t.types.u32
  n_delay_tranches: t.types.u32
  no_show_slots: t.types.u32
  needed_approvals: t.types.u32
}

export function SessionInfo(value: t.types.polkadot_primitives.v2.SessionInfo) {
  return value
}

export type UpgradeGoAhead = "Abort" | "GoAhead"

export type UpgradeRestriction = "Present"

export type ValidDisputeStatementKind =
  | t.types.polkadot_primitives.v2.ValidDisputeStatementKind.Explicit
  | t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded
  | t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid
  | t.types.polkadot_primitives.v2.ValidDisputeStatementKind.ApprovalChecking
export namespace ValidDisputeStatementKind {
  export interface Explicit {
    type: "Explicit"
  }
  export interface BackingSeconded {
    type: "BackingSeconded"
    value: t.types.primitive_types.H256
  }
  export interface BackingValid {
    type: "BackingValid"
    value: t.types.primitive_types.H256
  }
  export interface ApprovalChecking {
    type: "ApprovalChecking"
  }
  export function Explicit(): t.types.polkadot_primitives.v2.ValidDisputeStatementKind.Explicit {
    return { type: "Explicit" }
  }
  export function BackingSeconded(
    value: t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded["value"],
  ): t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingSeconded {
    return { type: "BackingSeconded", value }
  }
  export function BackingValid(
    value: t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid["value"],
  ): t.types.polkadot_primitives.v2.ValidDisputeStatementKind.BackingValid {
    return { type: "BackingValid", value }
  }
  export function ApprovalChecking(): t.types.polkadot_primitives.v2.ValidDisputeStatementKind.ApprovalChecking {
    return { type: "ApprovalChecking" }
  }
}

export type ValidatorIndex = t.types.u32

export function ValidatorIndex(value: t.types.polkadot_primitives.v2.ValidatorIndex) {
  return value
}

export type ValidityAttestation =
  | t.types.polkadot_primitives.v2.ValidityAttestation.Implicit
  | t.types.polkadot_primitives.v2.ValidityAttestation.Explicit
export namespace ValidityAttestation {
  export interface Implicit {
    type: "Implicit"
    value: t.types.polkadot_primitives.v2.validator_app.Signature
  }
  export interface Explicit {
    type: "Explicit"
    value: t.types.polkadot_primitives.v2.validator_app.Signature
  }
  export function Implicit(
    value: t.types.polkadot_primitives.v2.ValidityAttestation.Implicit["value"],
  ): t.types.polkadot_primitives.v2.ValidityAttestation.Implicit {
    return { type: "Implicit", value }
  }
  export function Explicit(
    value: t.types.polkadot_primitives.v2.ValidityAttestation.Explicit["value"],
  ): t.types.polkadot_primitives.v2.ValidityAttestation.Explicit {
    return { type: "Explicit", value }
  }
}
