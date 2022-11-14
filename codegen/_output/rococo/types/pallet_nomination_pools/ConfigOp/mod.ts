import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as $$sp_core from "./$$sp_core/mod.ts"

export type $$u128 =
  | types.pallet_nomination_pools.ConfigOp.$$u128.Noop
  | types.pallet_nomination_pools.ConfigOp.$$u128.Set
  | types.pallet_nomination_pools.ConfigOp.$$u128.Remove
export namespace $$u128 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: types.u128
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): types.pallet_nomination_pools.ConfigOp.$$u128.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: types.pallet_nomination_pools.ConfigOp.$$u128.Set["value"],
  ): types.pallet_nomination_pools.ConfigOp.$$u128.Set {
    return { type: "Set", value }
  }
  export function Remove(): types.pallet_nomination_pools.ConfigOp.$$u128.Remove {
    return { type: "Remove" }
  }
}

export type $$u32 =
  | types.pallet_nomination_pools.ConfigOp.$$u32.Noop
  | types.pallet_nomination_pools.ConfigOp.$$u32.Set
  | types.pallet_nomination_pools.ConfigOp.$$u32.Remove
export namespace $$u32 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: types.u32
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): types.pallet_nomination_pools.ConfigOp.$$u32.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: types.pallet_nomination_pools.ConfigOp.$$u32.Set["value"],
  ): types.pallet_nomination_pools.ConfigOp.$$u32.Set {
    return { type: "Set", value }
  }
  export function Remove(): types.pallet_nomination_pools.ConfigOp.$$u32.Remove {
    return { type: "Remove" }
  }
}
