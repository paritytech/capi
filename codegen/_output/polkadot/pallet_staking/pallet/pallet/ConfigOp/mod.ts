import { $, BitSequence, ChainError, Era } from "../../../../capi.ts"
import * as _codec from "../../../../codecs.ts"
import type * as t from "../../../../mod.ts"

export * as $$sp_arithmetic from "./$$sp_arithmetic/mod.ts"

export const $$$u128: $.Codec<t.pallet_staking.pallet.pallet.ConfigOp.$$u128> = _codec.$207

export const $$$u32: $.Codec<t.pallet_staking.pallet.pallet.ConfigOp.$$u32> = _codec.$208

export type $$u128 =
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Noop
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Set
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Remove
export namespace $$u128 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.u128
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Set["value"],
  ): t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.pallet_staking.pallet.pallet.ConfigOp.$$u128.Remove {
    return { type: "Remove" }
  }
}

export type $$u32 =
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Noop
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Set
  | t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Remove
export namespace $$u32 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.u32
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Set["value"],
  ): t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.pallet_staking.pallet.pallet.ConfigOp.$$u32.Remove {
    return { type: "Remove" }
  }
}
