import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as ConfigOp from "./ConfigOp/mod.ts"
export * as pallet from "./pallet.ts"

export const $bondExtra: $.Codec<t.pallet_nomination_pools.BondExtra> = _codec.$370

export const $bondedPoolInner: $.Codec<t.pallet_nomination_pools.BondedPoolInner> = _codec.$622

export const $poolMember: $.Codec<t.pallet_nomination_pools.PoolMember> = _codec.$617

export const $poolRoles: $.Codec<t.pallet_nomination_pools.PoolRoles> = _codec.$623

export const $poolState: $.Codec<t.pallet_nomination_pools.PoolState> = _codec.$91

export const $rewardPool: $.Codec<t.pallet_nomination_pools.RewardPool> = _codec.$624

export const $subPools: $.Codec<t.pallet_nomination_pools.SubPools> = _codec.$625

export const $unbondPool: $.Codec<t.pallet_nomination_pools.UnbondPool> = _codec.$626

export type BondExtra =
  | t.pallet_nomination_pools.BondExtra.FreeBalance
  | t.pallet_nomination_pools.BondExtra.Rewards
export namespace BondExtra {
  export interface FreeBalance {
    type: "FreeBalance"
    value: t.u128
  }
  export interface Rewards {
    type: "Rewards"
  }
  export function FreeBalance(
    value: t.pallet_nomination_pools.BondExtra.FreeBalance["value"],
  ): t.pallet_nomination_pools.BondExtra.FreeBalance {
    return { type: "FreeBalance", value }
  }
  export function Rewards(): t.pallet_nomination_pools.BondExtra.Rewards {
    return { type: "Rewards" }
  }
}

export interface BondedPoolInner {
  points: t.u128
  state: t.pallet_nomination_pools.PoolState
  member_counter: t.u32
  roles: t.pallet_nomination_pools.PoolRoles
}

export function BondedPoolInner(value: t.pallet_nomination_pools.BondedPoolInner) {
  return value
}

export interface PoolMember {
  pool_id: t.u32
  points: t.u128
  last_recorded_reward_counter: t.sp_arithmetic.fixed_point.FixedU128
  unbonding_eras: Map<t.u32, t.u128>
}

export function PoolMember(value: t.pallet_nomination_pools.PoolMember) {
  return value
}

export interface PoolRoles {
  depositor: t.sp_core.crypto.AccountId32
  root: t.sp_core.crypto.AccountId32 | undefined
  nominator: t.sp_core.crypto.AccountId32 | undefined
  state_toggler: t.sp_core.crypto.AccountId32 | undefined
}

export function PoolRoles(value: t.pallet_nomination_pools.PoolRoles) {
  return value
}

export type PoolState = "Open" | "Blocked" | "Destroying"

export interface RewardPool {
  last_recorded_reward_counter: t.sp_arithmetic.fixed_point.FixedU128
  last_recorded_total_payouts: t.u128
  total_rewards_claimed: t.u128
}

export function RewardPool(value: t.pallet_nomination_pools.RewardPool) {
  return value
}

export interface SubPools {
  no_era: t.pallet_nomination_pools.UnbondPool
  with_era: Map<t.u32, t.pallet_nomination_pools.UnbondPool>
}

export function SubPools(value: t.pallet_nomination_pools.SubPools) {
  return value
}

export interface UnbondPool {
  points: t.u128
  balance: t.u128
}

export function UnbondPool(value: t.pallet_nomination_pools.UnbondPool) {
  return value
}
