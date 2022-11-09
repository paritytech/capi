import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet/mod.ts"
export * as slashing from "./slashing.ts"

export const $activeEraInfo: $.Codec<t.pallet_staking.ActiveEraInfo> = _codec.$492

export const $eraRewardPoints: $.Codec<t.pallet_staking.EraRewardPoints> = _codec.$495

export const $exposure: $.Codec<t.pallet_staking.Exposure> = _codec.$57

export const $forcing: $.Codec<t.pallet_staking.Forcing> = _codec.$499

export const $individualExposure: $.Codec<t.pallet_staking.IndividualExposure> = _codec.$60

export const $nominations: $.Codec<t.pallet_staking.Nominations> = _codec.$490

export const $releases: $.Codec<t.pallet_staking.Releases> = _codec.$507

export const $rewardDestination: $.Codec<t.pallet_staking.RewardDestination> = _codec.$203

export const $stakingLedger: $.Codec<t.pallet_staking.StakingLedger> = _codec.$485

export const $unappliedSlash: $.Codec<t.pallet_staking.UnappliedSlash> = _codec.$501

export const $unlockChunk: $.Codec<t.pallet_staking.UnlockChunk> = _codec.$487

export const $validatorPrefs: $.Codec<t.pallet_staking.ValidatorPrefs> = _codec.$40

export interface ActiveEraInfo {
  index: t.u32
  start: t.u64 | undefined
}

export function ActiveEraInfo(value: t.pallet_staking.ActiveEraInfo) {
  return value
}

export interface EraRewardPoints {
  total: t.u32
  individual: Map<t.sp_core.crypto.AccountId32, t.u32>
}

export function EraRewardPoints(value: t.pallet_staking.EraRewardPoints) {
  return value
}

export interface Exposure {
  total: t.Compact<t.u128>
  own: t.Compact<t.u128>
  others: Array<t.pallet_staking.IndividualExposure>
}

export function Exposure(value: t.pallet_staking.Exposure) {
  return value
}

export type Forcing = "NotForcing" | "ForceNew" | "ForceNone" | "ForceAlways"

export interface IndividualExposure {
  who: t.sp_core.crypto.AccountId32
  value: t.Compact<t.u128>
}

export function IndividualExposure(value: t.pallet_staking.IndividualExposure) {
  return value
}

export interface Nominations {
  targets: Array<t.sp_core.crypto.AccountId32>
  submitted_in: t.u32
  suppressed: boolean
}

export function Nominations(value: t.pallet_staking.Nominations) {
  return value
}

export type Releases =
  | "V1_0_0Ancient"
  | "V2_0_0"
  | "V3_0_0"
  | "V4_0_0"
  | "V5_0_0"
  | "V6_0_0"
  | "V7_0_0"
  | "V8_0_0"
  | "V9_0_0"
  | "V10_0_0"
  | "V11_0_0"
  | "V12_0_0"

export type RewardDestination =
  | t.pallet_staking.RewardDestination.Staked
  | t.pallet_staking.RewardDestination.Stash
  | t.pallet_staking.RewardDestination.Controller
  | t.pallet_staking.RewardDestination.Account
  | t.pallet_staking.RewardDestination.None
export namespace RewardDestination {
  export interface Staked {
    type: "Staked"
  }
  export interface Stash {
    type: "Stash"
  }
  export interface Controller {
    type: "Controller"
  }
  export interface Account {
    type: "Account"
    value: t.sp_core.crypto.AccountId32
  }
  export interface None {
    type: "None"
  }
  export function Staked(): t.pallet_staking.RewardDestination.Staked {
    return { type: "Staked" }
  }
  export function Stash(): t.pallet_staking.RewardDestination.Stash {
    return { type: "Stash" }
  }
  export function Controller(): t.pallet_staking.RewardDestination.Controller {
    return { type: "Controller" }
  }
  export function Account(
    value: t.pallet_staking.RewardDestination.Account["value"],
  ): t.pallet_staking.RewardDestination.Account {
    return { type: "Account", value }
  }
  export function None(): t.pallet_staking.RewardDestination.None {
    return { type: "None" }
  }
}

export interface StakingLedger {
  stash: t.sp_core.crypto.AccountId32
  total: t.Compact<t.u128>
  active: t.Compact<t.u128>
  unlocking: Array<t.pallet_staking.UnlockChunk>
  claimed_rewards: Array<t.u32>
}

export function StakingLedger(value: t.pallet_staking.StakingLedger) {
  return value
}

export interface UnappliedSlash {
  validator: t.sp_core.crypto.AccountId32
  own: t.u128
  others: Array<[t.sp_core.crypto.AccountId32, t.u128]>
  reporters: Array<t.sp_core.crypto.AccountId32>
  payout: t.u128
}

export function UnappliedSlash(value: t.pallet_staking.UnappliedSlash) {
  return value
}

export interface UnlockChunk {
  value: t.Compact<t.u128>
  era: t.Compact<t.u32>
}

export function UnlockChunk(value: t.pallet_staking.UnlockChunk) {
  return value
}

export interface ValidatorPrefs {
  commission: t.Compact<t.sp_arithmetic.per_things.Perbill>
  blocked: boolean
}

export function ValidatorPrefs(value: t.pallet_staking.ValidatorPrefs) {
  return value
}
