import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as junction from "./junction.ts"
export * as multiasset from "./multiasset.ts"
export * as multilocation from "./multilocation.ts"
export * as order from "./order.ts"

export type Response = types.xcm.v1.Response.Assets | types.xcm.v1.Response.Version
export namespace Response {
  export interface Assets {
    type: "Assets"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface Version {
    type: "Version"
    value: types.u32
  }
  export function Assets(
    value: types.xcm.v1.Response.Assets["value"],
  ): types.xcm.v1.Response.Assets {
    return { type: "Assets", value }
  }
  export function Version(
    value: types.xcm.v1.Response.Version["value"],
  ): types.xcm.v1.Response.Version {
    return { type: "Version", value }
  }
}

export type Xcm =
  | types.xcm.v1.Xcm.WithdrawAsset
  | types.xcm.v1.Xcm.ReserveAssetDeposited
  | types.xcm.v1.Xcm.ReceiveTeleportedAsset
  | types.xcm.v1.Xcm.QueryResponse
  | types.xcm.v1.Xcm.TransferAsset
  | types.xcm.v1.Xcm.TransferReserveAsset
  | types.xcm.v1.Xcm.Transact
  | types.xcm.v1.Xcm.HrmpNewChannelOpenRequest
  | types.xcm.v1.Xcm.HrmpChannelAccepted
  | types.xcm.v1.Xcm.HrmpChannelClosing
  | types.xcm.v1.Xcm.RelayedFrom
  | types.xcm.v1.Xcm.SubscribeVersion
  | types.xcm.v1.Xcm.UnsubscribeVersion
export namespace Xcm {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    assets: types.xcm.v1.multiasset.MultiAssets
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface ReserveAssetDeposited {
    type: "ReserveAssetDeposited"
    assets: types.xcm.v1.multiasset.MultiAssets
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface ReceiveTeleportedAsset {
    type: "ReceiveTeleportedAsset"
    assets: types.xcm.v1.multiasset.MultiAssets
    effects: Array<types.xcm.v1.order.Order>
  }
  export interface QueryResponse {
    type: "QueryResponse"
    queryId: types.Compact<types.u64>
    response: types.xcm.v1.Response
  }
  export interface TransferAsset {
    type: "TransferAsset"
    assets: types.xcm.v1.multiasset.MultiAssets
    beneficiary: types.xcm.v1.multilocation.MultiLocation
  }
  export interface TransferReserveAsset {
    type: "TransferReserveAsset"
    assets: types.xcm.v1.multiasset.MultiAssets
    dest: types.xcm.v1.multilocation.MultiLocation
    effects: Array<types.xcm.v1.order.Order>
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
    who: types.xcm.v1.multilocation.Junctions
    message: types.xcm.v1.Xcm
  }
  export interface SubscribeVersion {
    type: "SubscribeVersion"
    queryId: types.Compact<types.u64>
    maxResponseWeight: types.Compact<types.u64>
  }
  export interface UnsubscribeVersion {
    type: "UnsubscribeVersion"
  }
  export function WithdrawAsset(
    value: Omit<types.xcm.v1.Xcm.WithdrawAsset, "type">,
  ): types.xcm.v1.Xcm.WithdrawAsset {
    return { type: "WithdrawAsset", ...value }
  }
  export function ReserveAssetDeposited(
    value: Omit<types.xcm.v1.Xcm.ReserveAssetDeposited, "type">,
  ): types.xcm.v1.Xcm.ReserveAssetDeposited {
    return { type: "ReserveAssetDeposited", ...value }
  }
  export function ReceiveTeleportedAsset(
    value: Omit<types.xcm.v1.Xcm.ReceiveTeleportedAsset, "type">,
  ): types.xcm.v1.Xcm.ReceiveTeleportedAsset {
    return { type: "ReceiveTeleportedAsset", ...value }
  }
  export function QueryResponse(
    value: Omit<types.xcm.v1.Xcm.QueryResponse, "type">,
  ): types.xcm.v1.Xcm.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<types.xcm.v1.Xcm.TransferAsset, "type">,
  ): types.xcm.v1.Xcm.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<types.xcm.v1.Xcm.TransferReserveAsset, "type">,
  ): types.xcm.v1.Xcm.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<types.xcm.v1.Xcm.Transact, "type">,
  ): types.xcm.v1.Xcm.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<types.xcm.v1.Xcm.HrmpNewChannelOpenRequest, "type">,
  ): types.xcm.v1.Xcm.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<types.xcm.v1.Xcm.HrmpChannelAccepted, "type">,
  ): types.xcm.v1.Xcm.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<types.xcm.v1.Xcm.HrmpChannelClosing, "type">,
  ): types.xcm.v1.Xcm.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function RelayedFrom(
    value: Omit<types.xcm.v1.Xcm.RelayedFrom, "type">,
  ): types.xcm.v1.Xcm.RelayedFrom {
    return { type: "RelayedFrom", ...value }
  }
  export function SubscribeVersion(
    value: Omit<types.xcm.v1.Xcm.SubscribeVersion, "type">,
  ): types.xcm.v1.Xcm.SubscribeVersion {
    return { type: "SubscribeVersion", ...value }
  }
  export function UnsubscribeVersion(): types.xcm.v1.Xcm.UnsubscribeVersion {
    return { type: "UnsubscribeVersion" }
  }
}
