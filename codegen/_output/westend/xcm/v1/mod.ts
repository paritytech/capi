import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as junction from "./junction.ts"
export * as multiasset from "./multiasset.ts"
export * as multilocation from "./multilocation.ts"
export * as order from "./order.ts"

export const $response: $.Codec<t.xcm.v1.Response> = _codec.$434

export const $xcm: $.Codec<t.xcm.v1.Xcm> = _codec.$430

export type Response = t.xcm.v1.Response.Assets | t.xcm.v1.Response.Version
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface Version {
    type: "Version"
    value: t.u32
  }
  export function Assets(value: t.xcm.v1.Response.Assets["value"]): t.xcm.v1.Response.Assets {
    return { type: "Assets", value }
  }
  export function Version(value: t.xcm.v1.Response.Version["value"]): t.xcm.v1.Response.Version {
    return { type: "Version", value }
  }
}

export type Xcm =
  | t.xcm.v1.Xcm.WithdrawAsset
  | t.xcm.v1.Xcm.ReserveAssetDeposited
  | t.xcm.v1.Xcm.ReceiveTeleportedAsset
  | t.xcm.v1.Xcm.QueryResponse
  | t.xcm.v1.Xcm.TransferAsset
  | t.xcm.v1.Xcm.TransferReserveAsset
  | t.xcm.v1.Xcm.Transact
  | t.xcm.v1.Xcm.HrmpNewChannelOpenRequest
  | t.xcm.v1.Xcm.HrmpChannelAccepted
  | t.xcm.v1.Xcm.HrmpChannelClosing
  | t.xcm.v1.Xcm.RelayedFrom
  | t.xcm.v1.Xcm.SubscribeVersion
  | t.xcm.v1.Xcm.UnsubscribeVersion
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: t.xcm.v1.multiasset.MultiAssets
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface ReserveAssetDeposited {
    type: "ReserveAssetDeposited"
    assets: t.xcm.v1.multiasset.MultiAssets
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface ReceiveTeleportedAsset {
    type: "ReceiveTeleportedAsset"
    assets: t.xcm.v1.multiasset.MultiAssets
    effects: Array<t.xcm.v1.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: t.Compact<t.u64>
    response: t.xcm.v1.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: t.xcm.v1.multiasset.MultiAssets
    beneficiary: t.xcm.v1.multilocation.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: t.xcm.v1.multiasset.MultiAssets
    dest: t.xcm.v1.multilocation.MultiLocation
    effects: Array<t.xcm.v1.order.Order>
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
    who: t.xcm.v1.multilocation.Junctions
    message: t.xcm.v1.Xcm
  }
  export interface SubscribeVersion {
    type: "SubscribeVersion"
    query_id: t.Compact<t.u64>
    max_response_weight: t.Compact<t.u64>
  }
  export interface UnsubscribeVersion {
    type: "UnsubscribeVersion"
  }
  export function WithdrawAsset(
    value: Omit<t.xcm.v1.Xcm.WithdrawAsset, "type">,
  ): t.xcm.v1.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposited(
    value: Omit<t.xcm.v1.Xcm.ReserveAssetDeposited, "type">,
  ): t.xcm.v1.Xcm.ReserveAssetDeposited {
    return { type: "ReserveAssetDeposited", ...value }
  }
  export function ReceiveTeleportedAsset(
    value: Omit<t.xcm.v1.Xcm.ReceiveTeleportedAsset, "type">,
  ): t.xcm.v1.Xcm.ReceiveTeleportedAsset {
    return { type: "ReceiveTeleportedAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<t.xcm.v1.Xcm.QueryResponse, "type">,
  ): t.xcm.v1.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<t.xcm.v1.Xcm.TransferAsset, "type">,
  ): t.xcm.v1.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<t.xcm.v1.Xcm.TransferReserveAsset, "type">,
  ): t.xcm.v1.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(value: Omit<t.xcm.v1.Xcm.Transact, "type">): t.xcm.v1.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<t.xcm.v1.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): t.xcm.v1.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<t.xcm.v1.Xcm.HrmpChannelAccepted, "type">,
  ): t.xcm.v1.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<t.xcm.v1.Xcm.HrmpChannelClosing, "type">,
  ): t.xcm.v1.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<t.xcm.v1.Xcm.RelayedFrom, "type">,
  ): t.xcm.v1.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
  export function SubscribeVersion(
    value: Omit<t.xcm.v1.Xcm.SubscribeVersion, "type">,
  ): t.xcm.v1.Xcm.SubscribeVersion {
    return { type: "SubscribeVersion", ...value }
  }
  export function UnsubscribeVersion(): t.xcm.v1.Xcm.UnsubscribeVersion {
    return { type: "UnsubscribeVersion" }
  }
}
