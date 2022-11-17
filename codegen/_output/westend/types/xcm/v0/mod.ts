import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as junction from "./junction.ts"
export * as multi_asset from "./multi_asset.ts"
export * as multi_location from "./multi_location.ts"
export * as order from "./order.ts"

export type OriginKind = "Native" | "SovereignAccount" | "Superuser" | "Xcm"

export type Response = types.xcm.v0.Response.Assets
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: Array<types.xcm.v0.multi_asset.MultiAsset>
  }
  export function Assets(
    value: types.xcm.v0.Response.Assets["value"],
  ): types.xcm.v0.Response.Assets {
    return { type: "Assets", value }
  }
}

export type Xcm =
  | types.xcm.v0.Xcm.WithdrawAsset
  | types.xcm.v0.Xcm.ReserveAssetDeposit
  | types.xcm.v0.Xcm.TeleportAsset
  | types.xcm.v0.Xcm.QueryResponse
  | types.xcm.v0.Xcm.TransferAsset
  | types.xcm.v0.Xcm.TransferReserveAsset
  | types.xcm.v0.Xcm.Transact
  | types.xcm.v0.Xcm.HrmpNewChannelOpenRequest
  | types.xcm.v0.Xcm.HrmpChannelAccepted
  | types.xcm.v0.Xcm.HrmpChannelClosing
  | types.xcm.v0.Xcm.RelayedFrom
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface ReserveAssetDeposit {
    type: "ReserveAssetDeposit"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface TeleportAsset {
    type: "TeleportAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    queryId: types.Compact<types.u64>
    response: types.xcm.v0.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    dest: types.xcm.v0.multi_location.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: Array<types.xcm.v0.multi_asset.MultiAsset>
    dest: types.xcm.v0.multi_location.MultiLocation
    effects: Array<types.xcm.v0.order.Order>
  }
  export interface Transact {
    type: "Transact"
    originType: types.xcm.v0.OriginKind
    requireWeightAtMost: types.u64
    call: types.xcm.double_encoded.DoubleEncoded
  }
  export interface HrmpNewChannelOpenRequest {
    type: "HrmpNewChannelOpenRequest"
    sender: types.Compact<types.u32>
    maxMessageSize: types.Compact<types.u32>
    maxCapacity: types.Compact<types.u32>
  }
  export interface HrmpChannelAccepted {
    type: "HrmpChannelAccepted"
    recipient: types.Compact<types.u32>
  }
  export interface HrmpChannelClosing {
    type: "HrmpChannelClosing"
    initiator: types.Compact<types.u32>
    sender: types.Compact<types.u32>
    recipient: types.Compact<types.u32>
  }
  export interface RelayedFrom {
    type: "RelayedFrom"
    who: types.xcm.v0.multi_location.MultiLocation
    message: types.xcm.v0.Xcm
  }
  export function WithdrawAsset(
    value: Omit<types.xcm.v0.Xcm.WithdrawAsset, "type">,
  ): types.xcm.v0.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposit(
    value: Omit<types.xcm.v0.Xcm.ReserveAssetDeposit, "type">,
  ): types.xcm.v0.Xcm.ReserveAssetDeposit {
    return { type: "ReserveAssetDeposit", ...value }
  }
  export function TeleportAsset(
    value: Omit<types.xcm.v0.Xcm.TeleportAsset, "type">,
  ): types.xcm.v0.Xcm.TeleportAsset {
    return { type: "TeleportAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<types.xcm.v0.Xcm.QueryResponse, "type">,
  ): types.xcm.v0.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<types.xcm.v0.Xcm.TransferAsset, "type">,
  ): types.xcm.v0.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<types.xcm.v0.Xcm.TransferReserveAsset, "type">,
  ): types.xcm.v0.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<types.xcm.v0.Xcm.Transact, "type">,
  ): types.xcm.v0.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<types.xcm.v0.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): types.xcm.v0.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<types.xcm.v0.Xcm.HrmpChannelAccepted, "type">,
  ): types.xcm.v0.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<types.xcm.v0.Xcm.HrmpChannelClosing, "type">,
  ): types.xcm.v0.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<types.xcm.v0.Xcm.RelayedFrom, "type">,
  ): types.xcm.v0.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
}
