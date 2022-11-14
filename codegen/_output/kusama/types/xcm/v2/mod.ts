import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as traits from "./traits.ts"

export type Instruction =
  | types.xcm.v2.Instruction.WithdrawAsset
  | types.xcm.v2.Instruction.ReserveAssetDeposited
  | types.xcm.v2.Instruction.ReceiveTeleportedAsset
  | types.xcm.v2.Instruction.QueryResponse
  | types.xcm.v2.Instruction.TransferAsset
  | types.xcm.v2.Instruction.TransferReserveAsset
  | types.xcm.v2.Instruction.Transact
  | types.xcm.v2.Instruction.HrmpNewChannelOpenRequest
  | types.xcm.v2.Instruction.HrmpChannelAccepted
  | types.xcm.v2.Instruction.HrmpChannelClosing
  | types.xcm.v2.Instruction.ClearOrigin
  | types.xcm.v2.Instruction.DescendOrigin
  | types.xcm.v2.Instruction.ReportError
  | types.xcm.v2.Instruction.DepositAsset
  | types.xcm.v2.Instruction.DepositReserveAsset
  | types.xcm.v2.Instruction.ExchangeAsset
  | types.xcm.v2.Instruction.InitiateReserveWithdraw
  | types.xcm.v2.Instruction.InitiateTeleport
  | types.xcm.v2.Instruction.QueryHolding
  | types.xcm.v2.Instruction.BuyExecution
  | types.xcm.v2.Instruction.RefundSurplus
  | types.xcm.v2.Instruction.SetErrorHandler
  | types.xcm.v2.Instruction.SetAppendix
  | types.xcm.v2.Instruction.ClearError
  | types.xcm.v2.Instruction.ClaimAsset
  | types.xcm.v2.Instruction.Trap
  | types.xcm.v2.Instruction.SubscribeVersion
  | types.xcm.v2.Instruction.UnsubscribeVersion
export namespace Instruction {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface ReserveAssetDeposited {
    type: "ReserveAssetDeposited"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface ReceiveTeleportedAsset {
    type: "ReceiveTeleportedAsset"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: types.Compact<types.u64>
    response: types.xcm.v2.Response
    max_weight: types.Compact<types.u64>
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
    xcm: types.xcm.v2.Xcm
  }
  export interface Transact {
    type: "Transact"
    origin_type: types.xcm.v0.OriginKind
    require_weight_at_most: types.Compact<types.u64>
    call: types.xcm.double_encoded.DoubleEncoded
  }
  export interface HrmpNewChannelOpenRequest {
    type: "HrmpNewChannelOpenRequest"
    sender: types.Compact<types.u32>
    max_message_size: types.Compact<types.u32>
    max_capacity: types.Compact<types.u32>
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
  export interface ClearOrigin {
    type: "ClearOrigin"
  }
  export interface DescendOrigin {
    type: "DescendOrigin"
    value: types.xcm.v1.multilocation.Junctions
  }
  export interface ReportError {
    type: "ReportError"
    query_id: types.Compact<types.u64>
    dest: types.xcm.v1.multilocation.MultiLocation
    max_response_weight: types.Compact<types.u64>
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: types.Compact<types.u32>
    beneficiary: types.xcm.v1.multilocation.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    max_assets: types.Compact<types.u32>
    dest: types.xcm.v1.multilocation.MultiLocation
    xcm: types.xcm.v2.Xcm
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
    xcm: types.xcm.v2.Xcm
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    dest: types.xcm.v1.multilocation.MultiLocation
    xcm: types.xcm.v2.Xcm
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: types.Compact<types.u64>
    dest: types.xcm.v1.multilocation.MultiLocation
    assets: types.xcm.v1.multiasset.MultiAssetFilter
    max_response_weight: types.Compact<types.u64>
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: types.xcm.v1.multiasset.MultiAsset
    weight_limit: types.xcm.v2.WeightLimit
  }
  export interface RefundSurplus {
    type: "RefundSurplus"
  }
  export interface SetErrorHandler {
    type: "SetErrorHandler"
    value: types.xcm.v2.Xcm
  }
  export interface SetAppendix {
    type: "SetAppendix"
    value: types.xcm.v2.Xcm
  }
  export interface ClearError {
    type: "ClearError"
  }
  export interface ClaimAsset {
    type: "ClaimAsset"
    assets: types.xcm.v1.multiasset.MultiAssets
    ticket: types.xcm.v1.multilocation.MultiLocation
  }
  export interface Trap {
    type: "Trap"
    value: types.Compact<types.u64>
  }
  export interface SubscribeVersion {
    type: "SubscribeVersion"
    query_id: types.Compact<types.u64>
    max_response_weight: types.Compact<types.u64>
  }
  export interface UnsubscribeVersion {
    type: "UnsubscribeVersion"
  }
  export function WithdrawAsset(
    value: types.xcm.v2.Instruction.WithdrawAsset["value"],
  ): types.xcm.v2.Instruction.WithdrawAsset {
    return { type: "WithdrawAsset", value }
  }
  export function ReserveAssetDeposited(
    value: types.xcm.v2.Instruction.ReserveAssetDeposited["value"],
  ): types.xcm.v2.Instruction.ReserveAssetDeposited {
    return { type: "ReserveAssetDeposited", value }
  }
  export function ReceiveTeleportedAsset(
    value: types.xcm.v2.Instruction.ReceiveTeleportedAsset["value"],
  ): types.xcm.v2.Instruction.ReceiveTeleportedAsset {
    return { type: "ReceiveTeleportedAsset", value }
  }
  export function QueryResponse(
    value: Omit<types.xcm.v2.Instruction.QueryResponse, "type">,
  ): types.xcm.v2.Instruction.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<types.xcm.v2.Instruction.TransferAsset, "type">,
  ): types.xcm.v2.Instruction.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<types.xcm.v2.Instruction.TransferReserveAsset, "type">,
  ): types.xcm.v2.Instruction.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<types.xcm.v2.Instruction.Transact, "type">,
  ): types.xcm.v2.Instruction.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<types.xcm.v2.Instruction.HrmpNewChannelOpenRequest, "type">,
  ): types.xcm.v2.Instruction.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<types.xcm.v2.Instruction.HrmpChannelAccepted, "type">,
  ): types.xcm.v2.Instruction.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<types.xcm.v2.Instruction.HrmpChannelClosing, "type">,
  ): types.xcm.v2.Instruction.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function ClearOrigin(): types.xcm.v2.Instruction.ClearOrigin {
    return { type: "ClearOrigin" }
  }
  export function DescendOrigin(
    value: types.xcm.v2.Instruction.DescendOrigin["value"],
  ): types.xcm.v2.Instruction.DescendOrigin {
    return { type: "DescendOrigin", value }
  }
  export function ReportError(
    value: Omit<types.xcm.v2.Instruction.ReportError, "type">,
  ): types.xcm.v2.Instruction.ReportError {
    return { type: "ReportError", ...value }
  }
  export function DepositAsset(
    value: Omit<types.xcm.v2.Instruction.DepositAsset, "type">,
  ): types.xcm.v2.Instruction.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<types.xcm.v2.Instruction.DepositReserveAsset, "type">,
  ): types.xcm.v2.Instruction.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<types.xcm.v2.Instruction.ExchangeAsset, "type">,
  ): types.xcm.v2.Instruction.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<types.xcm.v2.Instruction.InitiateReserveWithdraw, "type">,
  ): types.xcm.v2.Instruction.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<types.xcm.v2.Instruction.InitiateTeleport, "type">,
  ): types.xcm.v2.Instruction.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<types.xcm.v2.Instruction.QueryHolding, "type">,
  ): types.xcm.v2.Instruction.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<types.xcm.v2.Instruction.BuyExecution, "type">,
  ): types.xcm.v2.Instruction.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
  export function RefundSurplus(): types.xcm.v2.Instruction.RefundSurplus {
    return { type: "RefundSurplus" }
  }
  export function SetErrorHandler(
    value: types.xcm.v2.Instruction.SetErrorHandler["value"],
  ): types.xcm.v2.Instruction.SetErrorHandler {
    return { type: "SetErrorHandler", value }
  }
  export function SetAppendix(
    value: types.xcm.v2.Instruction.SetAppendix["value"],
  ): types.xcm.v2.Instruction.SetAppendix {
    return { type: "SetAppendix", value }
  }
  export function ClearError(): types.xcm.v2.Instruction.ClearError {
    return { type: "ClearError" }
  }
  export function ClaimAsset(
    value: Omit<types.xcm.v2.Instruction.ClaimAsset, "type">,
  ): types.xcm.v2.Instruction.ClaimAsset {
    return { type: "ClaimAsset", ...value }
  }
  export function Trap(
    value: types.xcm.v2.Instruction.Trap["value"],
  ): types.xcm.v2.Instruction.Trap {
    return { type: "Trap", value }
  }
  export function SubscribeVersion(
    value: Omit<types.xcm.v2.Instruction.SubscribeVersion, "type">,
  ): types.xcm.v2.Instruction.SubscribeVersion {
    return { type: "SubscribeVersion", ...value }
  }
  export function UnsubscribeVersion(): types.xcm.v2.Instruction.UnsubscribeVersion {
    return { type: "UnsubscribeVersion" }
  }
}

export type Response =
  | types.xcm.v2.Response.Null
  | types.xcm.v2.Response.Assets
  | types.xcm.v2.Response.ExecutionResult
  | types.xcm.v2.Response.Version
export namespace Response {
  export interface Null {
    type: "Null"
  }
  export interface Assets {
    type: "Assets"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface ExecutionResult {
    type: "ExecutionResult"
    value: [types.u32, types.xcm.v2.traits.Error] | undefined
  }
  export interface Version {
    type: "Version"
    value: types.u32
  }
  export function Null(): types.xcm.v2.Response.Null {
    return { type: "Null" }
  }
  export function Assets(
    value: types.xcm.v2.Response.Assets["value"],
  ): types.xcm.v2.Response.Assets {
    return { type: "Assets", value }
  }
  export function ExecutionResult(
    value: types.xcm.v2.Response.ExecutionResult["value"],
  ): types.xcm.v2.Response.ExecutionResult {
    return { type: "ExecutionResult", value }
  }
  export function Version(
    value: types.xcm.v2.Response.Version["value"],
  ): types.xcm.v2.Response.Version {
    return { type: "Version", value }
  }
}

export type WeightLimit = types.xcm.v2.WeightLimit.Unlimited | types.xcm.v2.WeightLimit.Limited
export namespace WeightLimit {
  export interface Unlimited {
    type: "Unlimited"
  }
  export interface Limited {
    type: "Limited"
    value: types.Compact<types.u64>
  }
  export function Unlimited(): types.xcm.v2.WeightLimit.Unlimited {
    return { type: "Unlimited" }
  }
  export function Limited(
    value: types.xcm.v2.WeightLimit.Limited["value"],
  ): types.xcm.v2.WeightLimit.Limited {
    return { type: "Limited", value }
  }
}

export type Xcm = Array<types.xcm.v2.Instruction>

export function Xcm(value: types.xcm.v2.Xcm) {
  return value
}
