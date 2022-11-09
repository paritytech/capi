import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $order: $.Codec<t.xcm.v1.order.Order> = _codec.$432

export type Order =
  | t.xcm.v1.order.Order.Noop
  | t.xcm.v1.order.Order.DepositAsset
  | t.xcm.v1.order.Order.DepositReserveAsset
  | t.xcm.v1.order.Order.ExchangeAsset
  | t.xcm.v1.order.Order.InitiateReserveWithdraw
  | t.xcm.v1.order.Order.InitiateTeleport
  | t.xcm.v1.order.Order.QueryHolding
  | t.xcm.v1.order.Order.BuyExecution
export namespace Order {
  export interface Noop {
    type: "Noop"
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.u32
    beneficiary: t.xcm.v1.multilocation.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.u32
    dest: t.xcm.v1.multilocation.MultiLocation
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface ExchangeAsset {
    type: "ExchangeAsset"
    give: t.xcm.v1.multiasset.MultiAssetFilter
    receive: t.xcm.v1.multiasset.MultiAssets
  }
  export interface InitiateReserveWithdraw {
    type: "InitiateReserveWithdraw"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    reserve: t.xcm.v1.multilocation.MultiLocation
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    dest: t.xcm.v1.multilocation.MultiLocation
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: t.Compact<t.u64>
    dest: t.xcm.v1.multilocation.MultiLocation
    assets: t.xcm.v1.multiasset.MultiAssetFilter
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: t.xcm.v1.multiasset.MultiAsset
    weight: t.u64
    debt: t.u64
    halt_on_error: boolean
    instructions: Array<t.xcm.v1.Xcm>
  }
  export function Noop(): t.xcm.v1.order.Order.Noop {
    return { type: "Noop" }
  }
  export function DepositAsset(
    value: Omit<t.xcm.v1.order.Order.DepositAsset, "type">,
  ): t.xcm.v1.order.Order.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<t.xcm.v1.order.Order.DepositReserveAsset, "type">,
  ): t.xcm.v1.order.Order.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<t.xcm.v1.order.Order.ExchangeAsset, "type">,
  ): t.xcm.v1.order.Order.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<t.xcm.v1.order.Order.InitiateReserveWithdraw, "type">,
  ): t.xcm.v1.order.Order.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<t.xcm.v1.order.Order.InitiateTeleport, "type">,
  ): t.xcm.v1.order.Order.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<t.xcm.v1.order.Order.QueryHolding, "type">,
  ): t.xcm.v1.order.Order.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<t.xcm.v1.order.Order.BuyExecution, "type">,
  ): t.xcm.v1.order.Order.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
}
