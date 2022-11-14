import { $, C } from "../../../../capi.ts"
import * as codecs from "../../../../codecs.ts"
import type * as types from "../../../mod.ts"

export type AccountId32 =
  | types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop
  | types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set
  | types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove
export namespace AccountId32 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: types.sp_core.crypto.AccountId32
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set["value"],
  ): types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set {
    return { type: "Set", value }
  }
  export function Remove(): types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove {
    return { type: "Remove" }
  }
}
