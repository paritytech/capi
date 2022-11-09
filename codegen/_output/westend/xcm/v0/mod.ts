import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as junction from "./junction.ts"
export * as multi_asset from "./multi_asset.ts"
export * as multi_location from "./multi_location.ts"
export * as order from "./order.ts"

export const $originKind: $.Codec<t.xcm.v0.OriginKind> = _codec.$143

export const $response: $.Codec<t.xcm.v0.Response> = _codec.$429

export const $xcm: $.Codec<t.xcm.v0.Xcm> = _codec.$425

export type OriginKind = "Native" | "SovereignAccount" | "Superuser" | "Xcm"

export type Response = t.xcm.v0.Response.Assets
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: Array<t.xcm.v0.multi_asset.MultiAsset>
  }
  export function Assets(value: t.xcm.v0.Response.Assets["value"]): t.xcm.v0.Response.Assets {
    return { type: "Assets", value }
  }
}

export type Xcm =
  | t.xcm.v0.Xcm.WithdrawAsset
  | t.xcm.v0.Xcm.ReserveAssetDeposit
  | t.xcm.v0.Xcm.TeleportAsset
  | t.xcm.v0.Xcm.QueryResponse
  | t.xcm.v0.Xcm.TransferAsset
  | t.xcm.v0.Xcm.TransferReserveAsset
  | t.xcm.v0.Xcm.Transact
  | t.xcm.v0.Xcm.HrmpNewChannelOpenRequest
  | t.xcm.v0.Xcm.HrmpChannelAccepted
  | t.xcm.v0.Xcm.HrmpChannelClosing
  | t.xcm.v0.Xcm.RelayedFrom
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface ReserveAssetDeposit {
    type: "ReserveAssetDeposit"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface TeleportAsset {
    type: "TeleportAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: t.Compact<t.u64>
    response: t.xcm.v0.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    dest: t.xcm.v0.multi_location.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: Array<t.xcm.v0.multi_asset.MultiAsset>
    dest: t.xcm.v0.multi_location.MultiLocation
    effects: Array<t.xcm.v0.order.Order>
  }
  export interface Transact {
    type: "Transact"
    origin_type: t.xcm.v0.OriginKind
    require_weight_at_most: t.u64
    call: { encoded: Uint8Array }
  }
  export interface HrmpNewChannelOpenRequest {
    type: "HrmpNewChannelOpenRequest"
    sender: t.Compact<t.u32>
    max_message_size: t.Compact<t.u32>
    max_capacity: t.Compact<t.u32>
  }
  export interface HrmpChannelAccepted {
    type: "HrmpChannelAccepted"
    recipient: t.Compact<t.u32>
  }
  export interface HrmpChannelClosing {
    type: "HrmpChannelClosing"
    initiator: t.Compact<t.u32>
    sender: t.Compact<t.u32>
    recipient: t.Compact<t.u32>
  }
  export interface RelayedFrom {
    type: "RelayedFrom"
    who: t.xcm.v0.multi_location.MultiLocation
    message: t.xcm.v0.Xcm
  }
  export function WithdrawAsset(
    value: Omit<t.xcm.v0.Xcm.WithdrawAsset, "type">,
  ): t.xcm.v0.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposit(
    value: Omit<t.xcm.v0.Xcm.ReserveAssetDeposit, "type">,
  ): t.xcm.v0.Xcm.ReserveAssetDeposit {
    return { type: "ReserveAssetDeposit", ...value }
  }
  export function TeleportAsset(
    value: Omit<t.xcm.v0.Xcm.TeleportAsset, "type">,
  ): t.xcm.v0.Xcm.TeleportAsset {
    return { type: "TeleportAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<t.xcm.v0.Xcm.QueryResponse, "type">,
  ): t.xcm.v0.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<t.xcm.v0.Xcm.TransferAsset, "type">,
  ): t.xcm.v0.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<t.xcm.v0.Xcm.TransferReserveAsset, "type">,
  ): t.xcm.v0.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(value: Omit<t.xcm.v0.Xcm.Transact, "type">): t.xcm.v0.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<t.xcm.v0.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): t.xcm.v0.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<t.xcm.v0.Xcm.HrmpChannelAccepted, "type">,
  ): t.xcm.v0.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<t.xcm.v0.Xcm.HrmpChannelClosing, "type">,
  ): t.xcm.v0.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<t.xcm.v0.Xcm.RelayedFrom, "type">,
  ): t.xcm.v0.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
}
