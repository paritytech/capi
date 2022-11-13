import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet/mod.ts"
export * as slashing from "./slashing.ts"

export const $activeEraInfo: $.Codec<types.pallet_staking.ActiveEraInfo> = _codec.$492

export const $eraRewardPoints: $.Codec<types.pallet_staking.EraRewardPoints> = _codec.$495

export const $exposure: $.Codec<types.pallet_staking.Exposure> = _codec.$57

export const $forcing: $.Codec<types.pallet_staking.Forcing> = _codec.$499

export const $individualExposure: $.Codec<types.pallet_staking.IndividualExposure> = _codec.$60

export const $nominations: $.Codec<types.pallet_staking.Nominations> = _codec.$490

export const $releases: $.Codec<types.pallet_staking.Releases> = _codec.$507

export const $rewardDestination: $.Codec<types.pallet_staking.RewardDestination> = _codec.$203

export const $stakingLedger: $.Codec<types.pallet_staking.StakingLedger> = _codec.$485

export const $unappliedSlash: $.Codec<types.pallet_staking.UnappliedSlash> = _codec.$501

export const $unlockChunk: $.Codec<types.pallet_staking.UnlockChunk> = _codec.$487

export const $validatorPrefs: $.Codec<types.pallet_staking.ValidatorPrefs> = _codec.$40

export interface ActiveEraInfo {
  index: types.u32
  start: types.u64 | undefined
}

export function ActiveEraInfo(value: types.pallet_staking.ActiveEraInfo) {
  return value
}

export interface EraRewardPoints {
  total: types.u32
  individual: Map<types.sp_core.crypto.AccountId32, types.u32>
}

export function EraRewardPoints(value: types.pallet_staking.EraRewardPoints) {
  return value
}

export interface Exposure {
  total: types.Compact<types.u128>
  own: types.Compact<types.u128>
  others: Array<types.pallet_staking.IndividualExposure>
}

export function Exposure(value: types.pallet_staking.Exposure) {
  return value
}

export type Forcing = "NotForcing" | "ForceNew" | "ForceNone" | "ForceAlways"

export interface IndividualExposure {
  who: types.sp_core.crypto.AccountId32
  value: types.Compact<types.u128>
}

export function IndividualExposure(value: types.pallet_staking.IndividualExposure) {
  return value
}

export interface Nominations {
  targets: Array<types.sp_core.crypto.AccountId32>
  submitted_in: types.u32
  suppressed: boolean
}

export function Nominations(value: types.pallet_staking.Nominations) {
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
  | types.pallet_staking.RewardDestination.Staked
  | types.pallet_staking.RewardDestination.Stash
  | types.pallet_staking.RewardDestination.Controller
  | types.pallet_staking.RewardDestination.Account
  | types.pallet_staking.RewardDestination.None
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
    value: types.sp_core.crypto.AccountId32
  }
  export interface None {
    type: "None"
  }
  export function Staked(): types.pallet_staking.RewardDestination.Staked {
    return { type: "Staked" }
  }
  export function Stash(): types.pallet_staking.RewardDestination.Stash {
    return { type: "Stash" }
  }
  export function Controller(): types.pallet_staking.RewardDestination.Controller {
    return { type: "Controller" }
  }
  export function Account(
    value: types.pallet_staking.RewardDestination.Account["value"],
  ): types.pallet_staking.RewardDestination.Account {
    return { type: "Account", value }
  }
  export function None(): types.pallet_staking.RewardDestination.None {
    return { type: "None" }
  }
}

export interface StakingLedger {
  stash: types.sp_core.crypto.AccountId32
  total: types.Compact<types.u128>
  active: types.Compact<types.u128>
  unlocking: Array<types.pallet_staking.UnlockChunk>
  claimed_rewards: Array<types.u32>
}

export function StakingLedger(value: types.pallet_staking.StakingLedger) {
  return value
}

export interface UnappliedSlash {
  validator: types.sp_core.crypto.AccountId32
  own: types.u128
  others: Array<[types.sp_core.crypto.AccountId32, types.u128]>
  reporters: Array<types.sp_core.crypto.AccountId32>
  payout: types.u128
}

export function UnappliedSlash(value: types.pallet_staking.UnappliedSlash) {
  return value
}

export interface UnlockChunk {
  value: types.Compact<types.u128>
  era: types.Compact<types.u32>
}

export function UnlockChunk(value: types.pallet_staking.UnlockChunk) {
  return value
}

export interface ValidatorPrefs {
  commission: types.Compact<types.sp_arithmetic.per_things.Perbill>
  blocked: boolean
}

export function ValidatorPrefs(value: types.pallet_staking.ValidatorPrefs) {
  return value
}
