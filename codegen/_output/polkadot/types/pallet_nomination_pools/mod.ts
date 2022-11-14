import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as ConfigOp from "./ConfigOp/mod.ts"
export * as pallet from "./pallet.ts"

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

export interface BondedPoolInner {
  points: types.u128
  state: types.pallet_nomination_pools.PoolState
  member_counter: types.u32
  roles: types.pallet_nomination_pools.PoolRoles
}

export function BondedPoolInner(value: types.pallet_nomination_pools.BondedPoolInner) {
  return value
}

export interface PoolMember {
  pool_id: types.u32
  points: types.u128
  last_recorded_reward_counter: types.sp_arithmetic.fixed_point.FixedU128
  unbonding_eras: Map<types.u32, types.u128>
}

export function PoolMember(value: types.pallet_nomination_pools.PoolMember) {
  return value
}

export interface PoolRoles {
  depositor: types.sp_core.crypto.AccountId32
  root: types.sp_core.crypto.AccountId32 | undefined
  nominator: types.sp_core.crypto.AccountId32 | undefined
  state_toggler: types.sp_core.crypto.AccountId32 | undefined
}

export function PoolRoles(value: types.pallet_nomination_pools.PoolRoles) {
  return value
}

export type PoolState = "Open" | "Blocked" | "Destroying"

export interface RewardPool {
  last_recorded_reward_counter: types.sp_arithmetic.fixed_point.FixedU128
  last_recorded_total_payouts: types.u128
  total_rewards_claimed: types.u128
}

export function RewardPool(value: types.pallet_nomination_pools.RewardPool) {
  return value
}

export interface SubPools {
  no_era: types.pallet_nomination_pools.UnbondPool
  with_era: Map<types.u32, types.pallet_nomination_pools.UnbondPool>
}

export function SubPools(value: types.pallet_nomination_pools.SubPools) {
  return value
}

export interface UnbondPool {
  points: types.u128
  balance: types.u128
}

export function UnbondPool(value: types.pallet_nomination_pools.UnbondPool) {
  return value
}
