import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $order: $.Codec<t.types.xcm.v0.order.Order> = _codec.$427

export type Order =
  | t.types.xcm.v0.order.Order.Null
  | t.types.xcm.v0.order.Order.DepositAsset
  | t.types.xcm.v0.order.Order.DepositReserveAsset
  | t.types.xcm.v0.order.Order.ExchangeAsset
  | t.types.xcm.v0.order.Order.InitiateReserveWithdraw
  | t.types.xcm.v0.order.Order.InitiateTeleport
  | t.types.xcm.v0.order.Order.QueryHolding
  | t.types.xcm.v0.order.Order.BuyExecution
export namespace Order {
  export interface Null {
    type: "Null"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    dest: t.types.xcm.v0.multi_location.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    dest: t.types.xcm.v0.multi_location.MultiLocation
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    receive: Array<t.types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    reserve: t.types.xcm.v0.multi_location.MultiLocation
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    dest: t.types.xcm.v0.multi_location.MultiLocation
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: t.Compact<t.types.u64>
    dest: t.types.xcm.v0.multi_location.MultiLocation
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: t.types.xcm.v0.multi_asset.MultiAsset
    weight: t.types.u64
    debt: t.types.u64
    halt_on_error: boolean
    xcm: Array<t.types.xcm.v0.Xcm>
  }
  export function Null(): t.types.xcm.v0.order.Order.Null {
    return { type: "Null" }
  }
  export function DepositAsset(
    value: Omit<t.types.xcm.v0.order.Order.DepositAsset, "type">,
  ): t.types.xcm.v0.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<t.types.xcm.v0.order.Order.DepositReserveAsset, "type">,
  ): t.types.xcm.v0.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<t.types.xcm.v0.order.Order.ExchangeAsset, "type">,
  ): t.types.xcm.v0.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<t.types.xcm.v0.order.Order.InitiateReserveWithdraw, "type">,
  ): t.types.xcm.v0.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<t.types.xcm.v0.order.Order.InitiateTeleport, "type">,
  ): t.types.xcm.v0.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<t.types.xcm.v0.order.Order.QueryHolding, "type">,
  ): t.types.xcm.v0.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<t.types.xcm.v0.order.Order.BuyExecution, "type">,
  ): t.types.xcm.v0.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
