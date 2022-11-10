import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as junction from "./junction.ts"
export * as multiasset from "./multiasset.ts"
export * as multilocation from "./multilocation.ts"
export * as order from "./order.ts"

export const $response: $.Codec<t.types.xcm.v1.Response> = _codec.$434

export const $xcm: $.Codec<t.types.xcm.v1.Xcm> = _codec.$430

export type Response = t.types.xcm.v1.Response.Assets | t.types.xcm.v1.Response.Version
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: t.types.xcm.v1.multiasset.MultiAssets
  }
  export interface Version {
    type: "Version"
    value: t.types.u32
  }
  export function Assets(
    value: t.types.xcm.v1.Response.Assets["value"],
  ): t.types.xcm.v1.Response.Assets {
    return { type: "Assets", value }
  }
  export function Version(
    value: t.types.xcm.v1.Response.Version["value"],
  ): t.types.xcm.v1.Response.Version {
    return { type: "Version", value }
  }
}

export type Xcm =
  | t.types.xcm.v1.Xcm.WithdrawAsset
  | t.types.xcm.v1.Xcm.ReserveAssetDeposited
  | t.types.xcm.v1.Xcm.ReceiveTeleportedAsset
  | t.types.xcm.v1.Xcm.QueryResponse
  | t.types.xcm.v1.Xcm.TransferAsset
  | t.types.xcm.v1.Xcm.TransferReserveAsset
  | t.types.xcm.v1.Xcm.Transact
  | t.types.xcm.v1.Xcm.HrmpNewChannelOpenRequest
  | t.types.xcm.v1.Xcm.HrmpChannelAccepted
  | t.types.xcm.v1.Xcm.HrmpChannelClosing
  | t.types.xcm.v1.Xcm.RelayedFrom
  | t.types.xcm.v1.Xcm.SubscribeVersion
  | t.types.xcm.v1.Xcm.UnsubscribeVersion
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssets
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface ReserveAssetDeposited {
    type: "ReserveAssetDeposited"
    assets: t.types.xcm.v1.multiasset.MultiAssets
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface ReceiveTeleportedAsset {
    type: "ReceiveTeleportedAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssets
    effects: Array<t.types.xcm.v1.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: t.Compact<t.types.u64>
    response: t.types.xcm.v1.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssets
    beneficiary: t.types.xcm.v1.multilocation.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: t.types.xcm.v1.multiasset.MultiAssets
    dest: t.types.xcm.v1.multilocation.MultiLocation
    effects: Array<t.types.xcm.v1.order.Order>
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
    who: t.types.xcm.v1.multilocation.Junctions
    message: t.types.xcm.v1.Xcm
  }
  export interface SubscribeVersion {
    type: "SubscribeVersion"
    query_id: t.Compact<t.types.u64>
    max_response_weight: t.Compact<t.types.u64>
  }
  export interface UnsubscribeVersion {
    type: "UnsubscribeVersion"
  }
  export function WithdrawAsset(
    value: Omit<t.types.xcm.v1.Xcm.WithdrawAsset, "type">,
  ): t.types.xcm.v1.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposited(
    value: Omit<t.types.xcm.v1.Xcm.ReserveAssetDeposited, "type">,
  ): t.types.xcm.v1.Xcm.ReserveAssetDeposited {
    return { type: "ReserveAssetDeposited", ...value }
  }
  export function ReceiveTeleportedAsset(
    value: Omit<t.types.xcm.v1.Xcm.ReceiveTeleportedAsset, "type">,
  ): t.types.xcm.v1.Xcm.ReceiveTeleportedAsset {
    return { type: "ReceiveTeleportedAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<t.types.xcm.v1.Xcm.QueryResponse, "type">,
  ): t.types.xcm.v1.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<t.types.xcm.v1.Xcm.TransferAsset, "type">,
  ): t.types.xcm.v1.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<t.types.xcm.v1.Xcm.TransferReserveAsset, "type">,
  ): t.types.xcm.v1.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<t.types.xcm.v1.Xcm.Transact, "type">,
  ): t.types.xcm.v1.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<t.types.xcm.v1.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): t.types.xcm.v1.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<t.types.xcm.v1.Xcm.HrmpChannelAccepted, "type">,
  ): t.types.xcm.v1.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<t.types.xcm.v1.Xcm.HrmpChannelClosing, "type">,
  ): t.types.xcm.v1.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<t.types.xcm.v1.Xcm.RelayedFrom, "type">,
  ): t.types.xcm.v1.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
  export function SubscribeVersion(
    value: Omit<t.types.xcm.v1.Xcm.SubscribeVersion, "type">,
  ): t.types.xcm.v1.Xcm.SubscribeVersion {
    return { type: "SubscribeVersion", ...value }
  }
  export function UnsubscribeVersion(): t.types.xcm.v1.Xcm.UnsubscribeVersion {
    return { type: "UnsubscribeVersion" }
  }
}
