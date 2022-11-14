import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type Order =
  | types.xcm.v0.order.Order.Null
  | types.xcm.v0.order.Order.DepositAsset
  | types.xcm.v0.order.Order.DepositReserveAsset
  | types.xcm.v0.order.Order.ExchangeAsset
  | types.xcm.v0.order.Order.InitiateReserveWithdraw
  | types.xcm.v0.order.Order.InitiateTeleport
  | types.xcm.v0.order.Order.QueryHolding
  | types.xcm.v0.order.Order.BuyExecution
export namespace Order {
  export interface Null {
    type: "Null"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    dest: types.xcm.v0.multi_location.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    dest: types.xcm.v0.multi_location.MultiLocation
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: Array<types.xcm.v0.multi_asset.MultiAsset>
    receive: Array<types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    reserve: types.xcm.v0.multi_location.MultiLocation
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    dest: types.xcm.v0.multi_location.MultiLocation
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: types.Compact<types.u64>
    dest: types.xcm.v0.multi_location.MultiLocation
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: types.xcm.v0.multi_asset.MultiAsset
    weight: types.u64
    debt: types.u64
    halt_on_error: boolean
    xcm: Array<types.xcm.v0.Xcm>
  }
  export function Null(): types.xcm.v0.order.Order.Null {
    return { type: "Null" }
  }
  export function DepositAsset(
    value: Omit<types.xcm.v0.order.Order.DepositAsset, "type">,
  ): types.xcm.v0.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<types.xcm.v0.order.Order.DepositReserveAsset, "type">,
  ): types.xcm.v0.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<types.xcm.v0.order.Order.ExchangeAsset, "type">,
  ): types.xcm.v0.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<types.xcm.v0.order.Order.InitiateReserveWithdraw, "type">,
  ): types.xcm.v0.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<types.xcm.v0.order.Order.InitiateTeleport, "type">,
  ): types.xcm.v0.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<types.xcm.v0.order.Order.QueryHolding, "type">,
  ): types.xcm.v0.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<types.xcm.v0.order.Order.BuyExecution, "type">,
  ): types.xcm.v0.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
