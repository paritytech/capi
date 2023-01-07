import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"
export * as signed from "./signed.ts"

export const $electionCompute: $.Codec<types.pallet_election_provider_multi_phase.ElectionCompute> =
  codecs.$88
export type ElectionCompute = "OnChain" | "Signed" | "Unsigned" | "Fallback" | "Emergency"

export const $phase: $.Codec<types.pallet_election_provider_multi_phase.Phase> = codecs.$596
export type Phase =
  | types.pallet_election_provider_multi_phase.Phase.Off
  | types.pallet_election_provider_multi_phase.Phase.Signed
  | types.pallet_election_provider_multi_phase.Phase.Unsigned
  | types.pallet_election_provider_multi_phase.Phase.Emergency
export namespace Phase {
  export interface Off {
    type: "Off"
  }
  export interface Signed {
    type: "Signed"
  }
  export interface Unsigned {
    type: "Unsigned"
    value: [boolean, types.u32]
  }
  export interface Emergency {
    type: "Emergency"
  }
  export function Off(): types.pallet_election_provider_multi_phase.Phase.Off {
    return { type: "Off" }
  }
  export function Signed(): types.pallet_election_provider_multi_phase.Phase.Signed {
    return { type: "Signed" }
  }
  export function Unsigned(
    value: types.pallet_election_provider_multi_phase.Phase.Unsigned["value"],
  ): types.pallet_election_provider_multi_phase.Phase.Unsigned {
    return { type: "Unsigned", value }
  }
  export function Emergency(): types.pallet_election_provider_multi_phase.Phase.Emergency {
    return { type: "Emergency" }
  }
}

export const $rawSolution: $.Codec<types.pallet_election_provider_multi_phase.RawSolution> =
  codecs.$311
export interface RawSolution {
  solution: types.polkadot_runtime.NposCompactSolution16
  score: types.sp_npos_elections.ElectionScore
  round: types.u32
}

export function RawSolution(value: types.pallet_election_provider_multi_phase.RawSolution) {
  return value
}

export const $readySolution: $.Codec<types.pallet_election_provider_multi_phase.ReadySolution> =
  codecs.$598
export interface ReadySolution {
  supports: Array<[types.sp_core.crypto.AccountId32, types.sp_npos_elections.Support]>
  score: types.sp_npos_elections.ElectionScore
  compute: types.pallet_election_provider_multi_phase.ElectionCompute
}

export function ReadySolution(value: types.pallet_election_provider_multi_phase.ReadySolution) {
  return value
}

export const $roundSnapshot: $.Codec<types.pallet_election_provider_multi_phase.RoundSnapshot> =
  codecs.$599
export interface RoundSnapshot {
  voters: Array<
    [types.sp_core.crypto.AccountId32, types.u64, Array<types.sp_core.crypto.AccountId32>]
  >
  targets: Array<types.sp_core.crypto.AccountId32>
}

export function RoundSnapshot(value: types.pallet_election_provider_multi_phase.RoundSnapshot) {
  return value
}

export const $solutionOrSnapshotSize: $.Codec<
  types.pallet_election_provider_multi_phase.SolutionOrSnapshotSize
> = codecs.$363
export interface SolutionOrSnapshotSize {
  voters: types.Compact<types.u32>
  targets: types.Compact<types.u32>
}

export function SolutionOrSnapshotSize(
  value: types.pallet_election_provider_multi_phase.SolutionOrSnapshotSize,
) {
  return value
}
