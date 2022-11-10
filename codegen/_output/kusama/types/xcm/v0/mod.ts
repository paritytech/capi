import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as junction from "./junction.ts"
export * as multi_asset from "./multi_asset.ts"
export * as multi_location from "./multi_location.ts"
export * as order from "./order.ts"

export const $originKind: $.Codec<t.types.xcm.v0.OriginKind> = _codec.$143

export const $response: $.Codec<t.types.xcm.v0.Response> = _codec.$429

export const $xcm: $.Codec<t.types.xcm.v0.Xcm> = _codec.$425

export type OriginKind = "Native" | "SovereignAccount" | "Superuser" | "Xcm"

export type Response = t.types.xcm.v0.Response.Assets
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: Array<t.types.xcm.v0.multi_asset.MultiAsset>
  }
  export function Assets(
    value: t.types.xcm.v0.Response.Assets["value"],
  ): t.types.xcm.v0.Response.Assets {
    return { type: "Assets", value }
  }
}

export type Xcm =
  | t.types.xcm.v0.Xcm.WithdrawAsset
  | t.types.xcm.v0.Xcm.ReserveAssetDeposit
  | t.types.xcm.v0.Xcm.TeleportAsset
  | t.types.xcm.v0.Xcm.QueryResponse
  | t.types.xcm.v0.Xcm.TransferAsset
  | t.types.xcm.v0.Xcm.TransferReserveAsset
  | t.types.xcm.v0.Xcm.Transact
  | t.types.xcm.v0.Xcm.HrmpNewChannelOpenRequest
  | t.types.xcm.v0.Xcm.HrmpChannelAccepted
  | t.types.xcm.v0.Xcm.HrmpChannelClosing
  | t.types.xcm.v0.Xcm.RelayedFrom
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface ReserveAssetDeposit {
    type: "ReserveAssetDeposit"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface TeleportAsset {
    type: "TeleportAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: t.Compact<t.types.u64>
    response: t.types.xcm.v0.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    dest: t.types.xcm.v0.multi_location.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: Array<t.types.xcm.v0.multi_asset.MultiAsset>
    dest: t.types.xcm.v0.multi_location.MultiLocation
    effects: Array<t.types.xcm.v0.order.Order>
  }
  export interface Transact {
    type: "Transact"
    origin_type: t.types.xcm.v0.OriginKind
    require_weight_at_most: t.types.u64
    call: { encoded: Uint8Array }
  }
  export interface HrmpNewChannelOpenRequest {
    type: "HrmpNewChannelOpenRequest"
    sender: t.Compact<t.types.u32>
    max_message_size: t.Compact<t.types.u32>
    max_capacity: t.Compact<t.types.u32>
  }
  export interface HrmpChannelAccepted {
    type: "HrmpChannelAccepted"
    recipient: t.Compact<t.types.u32>
  }
  export interface HrmpChannelClosing {
    type: "HrmpChannelClosing"
    initiator: t.Compact<t.types.u32>
    sender: t.Compact<t.types.u32>
    recipient: t.Compact<t.types.u32>
  }
  export interface RelayedFrom {
    type: "RelayedFrom"
    who: t.types.xcm.v0.multi_location.MultiLocation
    message: t.types.xcm.v0.Xcm
  }
  export function WithdrawAsset(
    value: Omit<t.types.xcm.v0.Xcm.WithdrawAsset, "type">,
  ): t.types.xcm.v0.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposit(
    value: Omit<t.types.xcm.v0.Xcm.ReserveAssetDeposit, "type">,
  ): t.types.xcm.v0.Xcm.ReserveAssetDeposit {
    return { type: "ReserveAssetDeposit", ...value }
  }
  export function TeleportAsset(
    value: Omit<t.types.xcm.v0.Xcm.TeleportAsset, "type">,
  ): t.types.xcm.v0.Xcm.TeleportAsset {
    return { type: "TeleportAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<t.types.xcm.v0.Xcm.QueryResponse, "type">,
  ): t.types.xcm.v0.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<t.types.xcm.v0.Xcm.TransferAsset, "type">,
  ): t.types.xcm.v0.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<t.types.xcm.v0.Xcm.TransferReserveAsset, "type">,
  ): t.types.xcm.v0.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<t.types.xcm.v0.Xcm.Transact, "type">,
  ): t.types.xcm.v0.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<t.types.xcm.v0.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): t.types.xcm.v0.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<t.types.xcm.v0.Xcm.HrmpChannelAccepted, "type">,
  ): t.types.xcm.v0.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<t.types.xcm.v0.Xcm.HrmpChannelClosing, "type">,
  ): t.types.xcm.v0.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<t.types.xcm.v0.Xcm.RelayedFrom, "type">,
  ): t.types.xcm.v0.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
}
