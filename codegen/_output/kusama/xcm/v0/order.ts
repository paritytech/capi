import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $order: $.Codec<t.xcm.v0.order.Order> = _codec.$427

export type Order =
  | t.xcm.v0.order.Order.Null
  | t.xcm.v0.order.Order.DepositAsset
  | t.xcm.v0.order.Order.DepositReserveAsset
  | t.xcm.v0.order.Order.ExchangeAsset
  | t.xcm.v0.order.Order.InitiateReserveWithdraw
  | t.xcm.v0.order.Order.InitiateTeleport
  | t.xcm.v0.order.Order.QueryHolding
  | t.xcm.v0.order.Order.BuyExecution
export namespace Order {
  export interface Null {
    type: "Null"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    dest: t.xcm.v0.multi_location.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    dest: t.xcm.v0.multi_location.MultiLocation
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: Array<t.xcm.v0.multi_asset.MultiAsset>
    receive: Array<t.xcm.v0.multi_asset.MultiAsset>
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    reserve: t.xcm.v0.multi_location.MultiLocation
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    dest: t.xcm.v0.multi_location.MultiLocation
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: t.Compact<t.u64>
    dest: t.xcm.v0.multi_location.MultiLocation
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: t.xcm.v0.multi_asset.MultiAsset
    weight: t.u64
    debt: t.u64
    halt_on_error: boolean
    xcm: Array<t.xcm.v0.Xcm>
  }
  export function Null(): t.xcm.v0.order.Order.Null {
    return { type: "Null" }
  }
  export function DepositAsset(
    value: Omit<t.xcm.v0.order.Order.DepositAsset, "type">,
  ): t.xcm.v0.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<t.xcm.v0.order.Order.DepositReserveAsset, "type">,
  ): t.xcm.v0.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<t.xcm.v0.order.Order.ExchangeAsset, "type">,
  ): t.xcm.v0.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<t.xcm.v0.order.Order.InitiateReserveWithdraw, "type">,
  ): t.xcm.v0.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<t.xcm.v0.order.Order.InitiateTeleport, "type">,
  ): t.xcm.v0.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<t.xcm.v0.order.Order.QueryHolding, "type">,
  ): t.xcm.v0.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<t.xcm.v0.order.Order.BuyExecution, "type">,
  ): t.xcm.v0.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
