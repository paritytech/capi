import { $, BitSequence, ChainError, Era } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"
export const $accountId32: $.Codec<
  t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
> = _codec.$373

export type AccountId32 =
  | t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop
  | t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set
  | t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove
export namespace AccountId32 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.sp_core.crypto.AccountId32
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set["value"],
  ): t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove {
    return { type: "Remove" }
  }
}
