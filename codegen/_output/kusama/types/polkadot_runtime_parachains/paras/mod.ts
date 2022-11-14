import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface ParaGenesisArgs {
  genesis_head: types.polkadot_parachain.primitives.HeadData
  validation_code: types.polkadot_parachain.primitives.ValidationCode
  parachain: boolean
}

export function ParaGenesisArgs(value: types.polkadot_runtime_parachains.paras.ParaGenesisArgs) {
  return value
}

export type ParaLifecycle =
  | "Onboarding"
  | "Parathread"
  | "Parachain"
  | "UpgradingParathread"
  | "DowngradingParachain"
  | "OffboardingParathread"
  | "OffboardingParachain"

export interface ParaPastCodeMeta {
  upgrade_times: Array<types.polkadot_runtime_parachains.paras.ReplacementTimes>
  last_pruned: types.u32 | undefined
}

export function ParaPastCodeMeta(value: types.polkadot_runtime_parachains.paras.ParaPastCodeMeta) {
  return value
}

export interface PvfCheckActiveVoteState {
  votes_accept: $.BitSequence
  votes_reject: $.BitSequence
  age: types.u32
  created_at: types.u32
  causes: Array<types.polkadot_runtime_parachains.paras.PvfCheckCause>
}

export function PvfCheckActiveVoteState(
  value: types.polkadot_runtime_parachains.paras.PvfCheckActiveVoteState,
) {
  return value
}

export type PvfCheckCause =
  | types.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding
  | types.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade
export namespace PvfCheckCause {
  export interface Onboarding {
    type: "Onboarding"
    value: types.polkadot_parachain.primitives.Id
  }
  export interface Upgrade {
    type: "Upgrade"
    id: types.polkadot_parachain.primitives.Id
    relay_parent_number: types.u32
  }
  export function Onboarding(
    value: types.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding["value"],
  ): types.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding {
    return { type: "Onboarding", value }
  }
  export function Upgrade(
    value: Omit<types.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade, "type">,
  ): types.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade {
    return { type: "Upgrade", ...value }
  }
}

export interface ReplacementTimes {
  expected_at: types.u32
  activated_at: types.u32
}

export function ReplacementTimes(value: types.polkadot_runtime_parachains.paras.ReplacementTimes) {
  return value
}
