import { $, BitSequence, ChainError, Era } from "../../../../../capi.ts"
import * as _codec from "../../../../../codecs.ts"
import type * as t from "../../../../../mod.ts"
export const $perbill: $.Codec<
  t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill
> = _codec.$210

export const $percent: $.Codec<
  t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent
> = _codec.$209

export type Perbill =
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Noop
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Remove
export namespace Perbill {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.sp_arithmetic.per_things.Perbill
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set["value"],
  ): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill.Remove {
    return { type: "Remove" }
  }
}

export type Percent =
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Noop
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set
  | t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Remove
export namespace Percent {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.sp_arithmetic.per_things.Percent
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set["value"],
  ): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent.Remove {
    return { type: "Remove" }
  }
}
