import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $paraGenesisArgs: $.Codec<t.polkadot_runtime_parachains.paras.ParaGenesisArgs> =
  _codec.$678

export const $paraLifecycle: $.Codec<t.polkadot_runtime_parachains.paras.ParaLifecycle> =
  _codec.$670

export const $paraPastCodeMeta: $.Codec<t.polkadot_runtime_parachains.paras.ParaPastCodeMeta> =
  _codec.$672

export const $pvfCheckActiveVoteState: $.Codec<
  t.polkadot_runtime_parachains.paras.PvfCheckActiveVoteState
> = _codec.$666

export const $pvfCheckCause: $.Codec<t.polkadot_runtime_parachains.paras.PvfCheckCause> =
  _codec.$668

export const $replacementTimes: $.Codec<t.polkadot_runtime_parachains.paras.ReplacementTimes> =
  _codec.$674

export interface ParaGenesisArgs {
  genesis_head: t.polkadot_parachain.primitives.HeadData
  validation_code: t.polkadot_parachain.primitives.ValidationCode
  parachain: boolean
}

export function ParaGenesisArgs(value: t.polkadot_runtime_parachains.paras.ParaGenesisArgs) {
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
  upgrade_times: Array<t.polkadot_runtime_parachains.paras.ReplacementTimes>
  last_pruned: t.u32 | undefined
}

export function ParaPastCodeMeta(value: t.polkadot_runtime_parachains.paras.ParaPastCodeMeta) {
  return value
}

export interface PvfCheckActiveVoteState {
  votes_accept: $.BitSequence
  votes_reject: $.BitSequence
  age: t.u32
  created_at: t.u32
  causes: Array<t.polkadot_runtime_parachains.paras.PvfCheckCause>
}

export function PvfCheckActiveVoteState(
  value: t.polkadot_runtime_parachains.paras.PvfCheckActiveVoteState,
) {
  return value
}

export type PvfCheckCause =
  | t.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding
  | t.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade
export namespace PvfCheckCause {
  export interface Onboarding {
    type: "Onboarding"
    value: t.polkadot_parachain.primitives.Id
  }
  export interface Upgrade {
    type: "Upgrade"
    id: t.polkadot_parachain.primitives.Id
    relay_parent_number: t.u32
  }
  export function Onboarding(
    value: t.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding["value"],
  ): t.polkadot_runtime_parachains.paras.PvfCheckCause.Onboarding {
    return { type: "Onboarding", value }
  }
  export function Upgrade(
    value: Omit<t.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade, "type">,
  ): t.polkadot_runtime_parachains.paras.PvfCheckCause.Upgrade {
    return { type: "Upgrade", ...value }
  }
}

export interface ReplacementTimes {
  expected_at: t.u32
  activated_at: t.u32
}

export function ReplacementTimes(value: t.polkadot_runtime_parachains.paras.ReplacementTimes) {
  return value
}
