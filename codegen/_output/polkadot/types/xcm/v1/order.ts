import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $order: $.Codec<t.types.xcm.v1.order.Order> = _codec.$432

export type Order =
  | t.types.xcm.v1.order.Order.Noop
  | t.types.xcm.v1.order.Order.DepositAsset
  | t.types.xcm.v1.order.Order.DepositReserveAsset
  | t.types.xcm.v1.order.Order.ExchangeAsset
  | t.types.xcm.v1.order.Order.InitiateReserveWithdraw
  | t.types.xcm.v1.order.Order.InitiateTeleport
  | t.types.xcm.v1.order.Order.QueryHolding
  | t.types.xcm.v1.order.Order.BuyExecution
export namespace Order {
  export interface Noop {
    type: "Noop"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.types.u32
    beneficiary: t.types.xcm.v1.multilocation.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.types.u32
    dest: t.types.xcm.v1.multilocation.MultiLocation
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: t.types.xcm.v1.multiasset.MultiAssetFilter
    receive: t.types.xcm.v1.multiasset.MultiAssets
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: t.types.xcm.v1.multiasset.MultiAssetFilter
    reserve: t.types.xcm.v1.multilocation.MultiLocation
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: t.types.xcm.v1.multiasset.MultiAssetFilter
    dest: t.types.xcm.v1.multilocation.MultiLocation
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: t.Compact<t.types.u64>
    dest: t.types.xcm.v1.multilocation.MultiLocation
    assets: t.types.xcm.v1.multiasset.MultiAssetFilter
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: t.types.xcm.v1.multiasset.MultiAsset
    weight: t.types.u64
    debt: t.types.u64
    halt_on_error: boolean
    instructions: Array<t.types.xcm.v1.Xcm>
  }
  export function Noop(): t.types.xcm.v1.order.Order.Noop {
    return { type: "Noop" }
  }
  export function DepositAsset(
    value: Omit<t.types.xcm.v1.order.Order.DepositAsset, "type">,
  ): t.types.xcm.v1.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<t.types.xcm.v1.order.Order.DepositReserveAsset, "type">,
  ): t.types.xcm.v1.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<t.types.xcm.v1.order.Order.ExchangeAsset, "type">,
  ): t.types.xcm.v1.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<t.types.xcm.v1.order.Order.InitiateReserveWithdraw, "type">,
  ): t.types.xcm.v1.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<t.types.xcm.v1.order.Order.InitiateTeleport, "type">,
  ): t.types.xcm.v1.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<t.types.xcm.v1.order.Order.QueryHolding, "type">,
  ): t.types.xcm.v1.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<t.types.xcm.v1.order.Order.BuyExecution, "type">,
  ): t.types.xcm.v1.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
