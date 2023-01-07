import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet/mod.ts"
export * as slashing from "./slashing.ts"

export const $activeEraInfo: $.Codec<types.pallet_staking.ActiveEraInfo> = codecs.$488
export interface ActiveEraInfo {
  index: types.u32
  start: types.u64 | undefined
}

export function ActiveEraInfo(value: types.pallet_staking.ActiveEraInfo) {
  return value
}

export const $eraRewardPoints: $.Codec<types.pallet_staking.EraRewardPoints> = codecs.$491
export interface EraRewardPoints {
  total: types.u32
  individual: Map<types.sp_core.crypto.AccountId32, types.u32>
}

export function EraRewardPoints(value: types.pallet_staking.EraRewardPoints) {
  return value
}

export const $exposure: $.Codec<types.pallet_staking.Exposure> = codecs.$57
export interface Exposure {
  total: types.Compact<types.u128>
  own: types.Compact<types.u128>
  others: Array<types.pallet_staking.IndividualExposure>
}

export function Exposure(value: types.pallet_staking.Exposure) {
  return value
}

export const $forcing: $.Codec<types.pallet_staking.Forcing> = codecs.$495
export type Forcing = "NotForcing" | "ForceNew" | "ForceNone" | "ForceAlways"

export const $individualExposure: $.Codec<types.pallet_staking.IndividualExposure> = codecs.$60
export interface IndividualExposure {
  who: types.sp_core.crypto.AccountId32
  value: types.Compact<types.u128>
}

export function IndividualExposure(value: types.pallet_staking.IndividualExposure) {
  return value
}

export const $nominations: $.Codec<types.pallet_staking.Nominations> = codecs.$486
export interface Nominations {
  targets: Array<types.sp_core.crypto.AccountId32>
  submittedIn: types.u32
  suppressed: boolean
}

export function Nominations(value: types.pallet_staking.Nominations) {
  return value
}

export const $releases: $.Codec<types.pallet_staking.Releases> = codecs.$503
export type Releases =
  | "V100Ancient"
  | "V200"
  | "V300"
  | "V400"
  | "V500"
  | "V600"
  | "V700"
  | "V800"
  | "V900"
  | "V1000"

export const $rewardDestination: $.Codec<types.pallet_staking.RewardDestination> = codecs.$203
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

export const $stakingLedger: $.Codec<types.pallet_staking.StakingLedger> = codecs.$482
export interface StakingLedger {
  stash: types.sp_core.crypto.AccountId32
  total: types.Compact<types.u128>
  active: types.Compact<types.u128>
  unlocking: Array<types.pallet_staking.UnlockChunk>
  claimedRewards: Array<types.u32>
}

export function StakingLedger(value: types.pallet_staking.StakingLedger) {
  return value
}

export const $unappliedSlash: $.Codec<types.pallet_staking.UnappliedSlash> = codecs.$497
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

export const $unlockChunk: $.Codec<types.pallet_staking.UnlockChunk> = codecs.$484
export interface UnlockChunk {
  value: types.Compact<types.u128>
  era: types.Compact<types.u32>
}

export function UnlockChunk(value: types.pallet_staking.UnlockChunk) {
  return value
}

export const $validatorPrefs: $.Codec<types.pallet_staking.ValidatorPrefs> = codecs.$40
export interface ValidatorPrefs {
  commission: types.Compact<types.sp_arithmetic.per_things.Perbill>
  blocked: boolean
}

export function ValidatorPrefs(value: types.pallet_staking.ValidatorPrefs) {
  return value
}
