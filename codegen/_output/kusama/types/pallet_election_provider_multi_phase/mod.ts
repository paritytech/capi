import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"
export * as signed from "./signed.ts"

export const $electionCompute: $.Codec<
  t.types.pallet_election_provider_multi_phase.ElectionCompute
> = _codec.$87

export const $phase: $.Codec<t.types.pallet_election_provider_multi_phase.Phase> = _codec.$600

export const $rawSolution: $.Codec<t.types.pallet_election_provider_multi_phase.RawSolution> =
  _codec.$311

export const $readySolution: $.Codec<t.types.pallet_election_provider_multi_phase.ReadySolution> =
  _codec.$602

export const $roundSnapshot: $.Codec<t.types.pallet_election_provider_multi_phase.RoundSnapshot> =
  _codec.$603

export const $solutionOrSnapshotSize: $.Codec<
  t.types.pallet_election_provider_multi_phase.SolutionOrSnapshotSize
> = _codec.$363

export type ElectionCompute = "OnChain" | "Signed" | "Unsigned" | "Fallback" | "Emergency"

export type Phase =
  | t.types.pallet_election_provider_multi_phase.Phase.Off
  | t.types.pallet_election_provider_multi_phase.Phase.Signed
  | t.types.pallet_election_provider_multi_phase.Phase.Unsigned
  | t.types.pallet_election_provider_multi_phase.Phase.Emergency
export namespace Phase {
  export interface Off {
    type: "Off"
  }
  export interface Signed {
    type: "Signed"
  }
  export interface Unsigned {
    type: "Unsigned"
    value: [boolean, t.types.u32]
  }
  export interface Emergency {
    type: "Emergency"
  }
  export function Off(): t.types.pallet_election_provider_multi_phase.Phase.Off {
    return { type: "Off" }
  }
  export function Signed(): t.types.pallet_election_provider_multi_phase.Phase.Signed {
    return { type: "Signed" }
  }
  export function Unsigned(
    value: t.types.pallet_election_provider_multi_phase.Phase.Unsigned["value"],
  ): t.types.pallet_election_provider_multi_phase.Phase.Unsigned {
    return { type: "Unsigned", value }
  }
  export function Emergency(): t.types.pallet_election_provider_multi_phase.Phase.Emergency {
    return { type: "Emergency" }
  }
}

export interface RawSolution {
  solution: t.types.polkadot_runtime.NposCompactSolution16
  score: t.types.sp_npos_elections.ElectionScore
  round: t.types.u32
}

export function RawSolution(value: t.types.pallet_election_provider_multi_phase.RawSolution) {
  return value
}

export interface ReadySolution {
  supports: Array<[t.types.sp_core.crypto.AccountId32, t.types.sp_npos_elections.Support]>
  score: t.types.sp_npos_elections.ElectionScore
  compute: t.types.pallet_election_provider_multi_phase.ElectionCompute
}

export function ReadySolution(value: t.types.pallet_election_provider_multi_phase.ReadySolution) {
  return value
}

export interface RoundSnapshot {
  voters: Array<
    [t.types.sp_core.crypto.AccountId32, t.types.u64, Array<t.types.sp_core.crypto.AccountId32>]
  >
  targets: Array<t.types.sp_core.crypto.AccountId32>
}

export function RoundSnapshot(value: t.types.pallet_election_provider_multi_phase.RoundSnapshot) {
  return value
}

export interface SolutionOrSnapshotSize {
  voters: t.Compact<t.types.u32>
  targets: t.Compact<t.types.u32>
}

export function SolutionOrSnapshotSize(
  value: t.types.pallet_election_provider_multi_phase.SolutionOrSnapshotSize,
) {
  return value
}
