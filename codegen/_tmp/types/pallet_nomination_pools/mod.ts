import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as ConfigOp from "./ConfigOp/mod.ts"
export * as pallet from "./pallet.ts"

export const $bondExtra: $.Codec<types.pallet_nomination_pools.BondExtra> = codecs.$370
export type BondExtra =
  | types.pallet_nomination_pools.BondExtra.FreeBalance
  | types.pallet_nomination_pools.BondExtra.Rewards
export namespace BondExtra {
  export interface FreeBalance {
    type: "FreeBalance"
    value: types.u128
  }
  export interface Rewards {
    type: "Rewards"
  }
  export function FreeBalance(
    value: types.pallet_nomination_pools.BondExtra.FreeBalance["value"],
  ): types.pallet_nomination_pools.BondExtra.FreeBalance {
    return { type: "FreeBalance", value }
  }
  export function Rewards(): types.pallet_nomination_pools.BondExtra.Rewards {
    return { type: "Rewards" }
  }
}

export const $bondedPoolInner: $.Codec<types.pallet_nomination_pools.BondedPoolInner> = codecs.$618
export interface BondedPoolInner {
  points: types.u128
  state: types.pallet_nomination_pools.PoolState
  memberCounter: types.u32
  roles: types.pallet_nomination_pools.PoolRoles
}

export function BondedPoolInner(value: types.pallet_nomination_pools.BondedPoolInner) {
  return value
}

export const $poolMember: $.Codec<types.pallet_nomination_pools.PoolMember> = codecs.$613
export interface PoolMember {
  poolId: types.u32
  points: types.u128
  lastRecordedRewardCounter: types.sp_arithmetic.fixed_point.FixedU128
  unbondingEras: Map<types.u32, types.u128>
}

export function PoolMember(value: types.pallet_nomination_pools.PoolMember) {
  return value
}

export const $poolRoles: $.Codec<types.pallet_nomination_pools.PoolRoles> = codecs.$619
export interface PoolRoles {
  depositor: types.sp_core.crypto.AccountId32
  root: types.sp_core.crypto.AccountId32 | undefined
  nominator: types.sp_core.crypto.AccountId32 | undefined
  stateToggler: types.sp_core.crypto.AccountId32 | undefined
}

export function PoolRoles(value: types.pallet_nomination_pools.PoolRoles) {
  return value
}

export const $poolState: $.Codec<types.pallet_nomination_pools.PoolState> = codecs.$92
export type PoolState = "Open" | "Blocked" | "Destroying"

export const $rewardPool: $.Codec<types.pallet_nomination_pools.RewardPool> = codecs.$620
export interface RewardPool {
  lastRecordedRewardCounter: types.sp_arithmetic.fixed_point.FixedU128
  lastRecordedTotalPayouts: types.u128
  totalRewardsClaimed: types.u128
}

export function RewardPool(value: types.pallet_nomination_pools.RewardPool) {
  return value
}

export const $subPools: $.Codec<types.pallet_nomination_pools.SubPools> = codecs.$621
export interface SubPools {
  noEra: types.pallet_nomination_pools.UnbondPool
  withEra: Map<types.u32, types.pallet_nomination_pools.UnbondPool>
}

export function SubPools(value: types.pallet_nomination_pools.SubPools) {
  return value
}

export const $unbondPool: $.Codec<types.pallet_nomination_pools.UnbondPool> = codecs.$622
export interface UnbondPool {
  points: types.u128
  balance: types.u128
}

export function UnbondPool(value: types.pallet_nomination_pools.UnbondPool) {
  return value
}
