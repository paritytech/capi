import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type Order =
  | types.xcm.v1.order.Order.Noop
  | types.xcm.v1.order.Order.DepositAsset
  | types.xcm.v1.order.Order.DepositReserveAsset
  | types.xcm.v1.order.Order.ExchangeAsset
  | types.xcm.v1.order.Order.InitiateReserveWithdraw
  | types.xcm.v1.order.Order.InitiateTeleport
  | types.xcm.v1.order.Order.QueryHolding
  | types.xcm.v1.order.Order.BuyExecution
export namespace Order {
  export interface Noop {
    type: "Noop"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: types.u32
    beneficiary: types.xcm.v1.multilocation.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: types.u32
    dest: types.xcm.v1.multilocation.MultiLocation
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: types.xcm.v1.multiasset.MultiAssetFilter
    receive: types.xcm.v1.multiasset.MultiAssets
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    reserve: types.xcm.v1.multilocation.MultiLocation
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    dest: types.xcm.v1.multilocation.MultiLocation
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: types.Compact<types.u64>
    dest: types.xcm.v1.multilocation.MultiLocation
    assets: types.xcm.v1.multiasset.MultiAssetFilter
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: types.xcm.v1.multiasset.MultiAsset
    weight: types.u64
    debt: types.u64
    halt_on_error: boolean
    instructions: Array<types.xcm.v1.Xcm>
  }
  export function Noop(): types.xcm.v1.order.Order.Noop {
    return { type: "Noop" }
  }
  export function DepositAsset(
    value: Omit<types.xcm.v1.order.Order.DepositAsset, "type">,
  ): types.xcm.v1.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<types.xcm.v1.order.Order.DepositReserveAsset, "type">,
  ): types.xcm.v1.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<types.xcm.v1.order.Order.ExchangeAsset, "type">,
  ): types.xcm.v1.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<types.xcm.v1.order.Order.InitiateReserveWithdraw, "type">,
  ): types.xcm.v1.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<types.xcm.v1.order.Order.InitiateTeleport, "type">,
  ): types.xcm.v1.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<types.xcm.v1.order.Order.QueryHolding, "type">,
  ): types.xcm.v1.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<types.xcm.v1.order.Order.BuyExecution, "type">,
  ): types.xcm.v1.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
