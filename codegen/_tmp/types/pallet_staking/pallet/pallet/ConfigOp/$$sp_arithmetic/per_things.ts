import { $, C } from "../../../../../../capi.ts"
import * as codecs from "../../../../../../codecs.ts"
import type * as types from "../../../../../mod.ts"

export const $perbill: $.Codec<
  types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill
> = codecs.$210
export type Perbill =
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Noop
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Remove
export namespace Perbill {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: types.sp_arithmetic.per_things.Perbill
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value:
      types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set["value"],
  ): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set {
    return { type: "Set", value }
  }
  export function Remove(): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Remove {
    return { type: "Remove" }
  }
}

export const $percent: $.Codec<
  types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent
> = codecs.$209
export type Percent =
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Noop
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set
  | types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Remove
export namespace Percent {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: types.sp_arithmetic.per_things.Percent
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value:
      types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set["value"],
  ): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set {
    return { type: "Set", value }
  }
  export function Remove(): types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Remove {
    return { type: "Remove" }
  }
}
