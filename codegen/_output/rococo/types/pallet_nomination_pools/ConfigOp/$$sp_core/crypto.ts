import { $ } from "../../../../capi.ts"
import * as _codec from "../../../../codecs.ts"
import type * as t from "../../../../mod.ts"

export const $accountId32: $.Codec<
  t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32
> = _codec.$373

export type AccountId32 =
  | t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop
  | t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set
  | t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove
export namespace AccountId32 {
  export interface Noop {
    type: "Noop"
  }
  export interface Set {
    type: "Set"
    value: t.types.sp_core.crypto.AccountId32
  }
  export interface Remove {
    type: "Remove"
  }
  export function Noop(): t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Noop {
    return { type: "Noop" }
  }
  export function Set(
    value: t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set["value"],
  ): t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Set {
    return { type: "Set", value }
  }
  export function Remove(): t.types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32.Remove {
    return { type: "Remove" }
  }
}
