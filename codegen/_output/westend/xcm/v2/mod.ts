import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $instruction: $.Codec<t.xcm.v2.Instruction> = _codec.$132

export const $response: $.Codec<t.xcm.v2.Response> = _codec.$140

export const $weightLimit: $.Codec<t.xcm.v2.WeightLimit> = _codec.$148

export type Instruction =
  | t.xcm.v2.Instruction.WithdrawAsset
  | t.xcm.v2.Instruction.ReserveAssetDeposited
  | t.xcm.v2.Instruction.ReceiveTeleportedAsset
  | t.xcm.v2.Instruction.QueryResponse
  | t.xcm.v2.Instruction.TransferAsset
  | t.xcm.v2.Instruction.TransferReserveAsset
  | t.xcm.v2.Instruction.Transact
  | t.xcm.v2.Instruction.HrmpNewChannelOpenRequest
  | t.xcm.v2.Instruction.HrmpChannelAccepted
  | t.xcm.v2.Instruction.HrmpChannelClosing
  | t.xcm.v2.Instruction.ClearOrigin
  | t.xcm.v2.Instruction.DescendOrigin
  | t.xcm.v2.Instruction.ReportError
  | t.xcm.v2.Instruction.DepositAsset
  | t.xcm.v2.Instruction.DepositReserveAsset
  | t.xcm.v2.Instruction.ExchangeAsset
  | t.xcm.v2.Instruction.InitiateReserveWithdraw
  | t.xcm.v2.Instruction.InitiateTeleport
  | t.xcm.v2.Instruction.QueryHolding
  | t.xcm.v2.Instruction.BuyExecution
  | t.xcm.v2.Instruction.RefundSurplus
  | t.xcm.v2.Instruction.SetErrorHandler
  | t.xcm.v2.Instruction.SetAppendix
  | t.xcm.v2.Instruction.ClearError
  | t.xcm.v2.Instruction.ClaimAsset
  | t.xcm.v2.Instruction.Trap
  | t.xcm.v2.Instruction.SubscribeVersion
  | t.xcm.v2.Instruction.UnsubscribeVersion
export namespace Instruction {
  export interface WithdrawAsset {
    type: "WithdrawAsset"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface ReserveAssetDeposited {
    type: "ReserveAssetDeposited"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface ReceiveTeleportedAsset {
    type: "ReceiveTeleportedAsset"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface QueryResponse {
    type: "QueryResponse"
    query_id: t.Compact<t.u64>
    response: t.xcm.v2.Response
    max_weight: t.Compact<t.u64>
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
    xcm: Array<t.xcm.v2.Instruction>
  }
  export interface Transact {
    type: "Transact"
    origin_type: t.xcm.v0.OriginKind
    require_weight_at_most: t.Compact<t.u64>
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
  export interface ClearOrigin {
    type: "ClearOrigin"
  }
  export interface DescendOrigin {
    type: "DescendOrigin"
    value: t.xcm.v1.multilocation.Junctions
  }
  export interface ReportError {
    type: "ReportError"
    query_id: t.Compact<t.u64>
    dest: t.xcm.v1.multilocation.MultiLocation
    max_response_weight: t.Compact<t.u64>
  }
  export interface DepositAsset {
    type: "DepositAsset"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.Compact<t.u32>
    beneficiary: t.xcm.v1.multilocation.MultiLocation
  }
  export interface DepositReserveAsset {
    type: "DepositReserveAsset"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    max_assets: t.Compact<t.u32>
    dest: t.xcm.v1.multilocation.MultiLocation
    xcm: Array<t.xcm.v2.Instruction>
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
    xcm: Array<t.xcm.v2.Instruction>
  }
  export interface InitiateTeleport {
    type: "InitiateTeleport"
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    dest: t.xcm.v1.multilocation.MultiLocation
    xcm: Array<t.xcm.v2.Instruction>
  }
  export interface QueryHolding {
    type: "QueryHolding"
    query_id: t.Compact<t.u64>
    dest: t.xcm.v1.multilocation.MultiLocation
    assets: t.xcm.v1.multiasset.MultiAssetFilter
    max_response_weight: t.Compact<t.u64>
  }
  export interface BuyExecution {
    type: "BuyExecution"
    fees: t.xcm.v1.multiasset.MultiAsset
    weight_limit: t.xcm.v2.WeightLimit
  }
  export interface RefundSurplus {
    type: "RefundSurplus"
  }
  export interface SetErrorHandler {
    type: "SetErrorHandler"
    value: Array<t.xcm.v2.Instruction>
  }
  export interface SetAppendix {
    type: "SetAppendix"
    value: Array<t.xcm.v2.Instruction>
  }
  export interface ClearError {
    type: "ClearError"
  }
  export interface ClaimAsset {
    type: "ClaimAsset"
    assets: t.xcm.v1.multiasset.MultiAssets
    ticket: t.xcm.v1.multilocation.MultiLocation
  }
  export interface Trap {
    type: "Trap"
    value: t.Compact<t.u64>
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
    value: t.xcm.v2.Instruction.WithdrawAsset["value"],
  ): t.xcm.v2.Instruction.WithdrawAsset {
    return { type: "WithdrawAsset", value }
  }
  export function ReserveAssetDeposited(
    value: t.xcm.v2.Instruction.ReserveAssetDeposited["value"],
  ): t.xcm.v2.Instruction.ReserveAssetDeposited {
    return { type: "ReserveAssetDeposited", value }
  }
  export function ReceiveTeleportedAsset(
    value: t.xcm.v2.Instruction.ReceiveTeleportedAsset["value"],
  ): t.xcm.v2.Instruction.ReceiveTeleportedAsset {
    return { type: "ReceiveTeleportedAsset", value }
  }
  export function QueryResponse(
    value: Omit<t.xcm.v2.Instruction.QueryResponse, "type">,
  ): t.xcm.v2.Instruction.QueryResponse {
    return { type: "QueryResponse", ...value }
  }
  export function TransferAsset(
    value: Omit<t.xcm.v2.Instruction.TransferAsset, "type">,
  ): t.xcm.v2.Instruction.TransferAsset {
    return { type: "TransferAsset", ...value }
  }
  export function TransferReserveAsset(
    value: Omit<t.xcm.v2.Instruction.TransferReserveAsset, "type">,
  ): t.xcm.v2.Instruction.TransferReserveAsset {
    return { type: "TransferReserveAsset", ...value }
  }
  export function Transact(
    value: Omit<t.xcm.v2.Instruction.Transact, "type">,
  ): t.xcm.v2.Instruction.Transact {
    return { type: "Transact", ...value }
  }
  export function HrmpNewChannelOpenRequest(
    value: Omit<t.xcm.v2.Instruction.HrmpNewChannelOpenRequest, "type">,
  ): t.xcm.v2.Instruction.HrmpNewChannelOpenRequest {
    return { type: "HrmpNewChannelOpenRequest", ...value }
  }
  export function HrmpChannelAccepted(
    value: Omit<t.xcm.v2.Instruction.HrmpChannelAccepted, "type">,
  ): t.xcm.v2.Instruction.HrmpChannelAccepted {
    return { type: "HrmpChannelAccepted", ...value }
  }
  export function HrmpChannelClosing(
    value: Omit<t.xcm.v2.Instruction.HrmpChannelClosing, "type">,
  ): t.xcm.v2.Instruction.HrmpChannelClosing {
    return { type: "HrmpChannelClosing", ...value }
  }
  export function ClearOrigin(): t.xcm.v2.Instruction.ClearOrigin {
    return { type: "ClearOrigin" }
  }
  export function DescendOrigin(
    value: t.xcm.v2.Instruction.DescendOrigin["value"],
  ): t.xcm.v2.Instruction.DescendOrigin {
    return { type: "DescendOrigin", value }
  }
  export function ReportError(
    value: Omit<t.xcm.v2.Instruction.ReportError, "type">,
  ): t.xcm.v2.Instruction.ReportError {
    return { type: "ReportError", ...value }
  }
  export function DepositAsset(
    value: Omit<t.xcm.v2.Instruction.DepositAsset, "type">,
  ): t.xcm.v2.Instruction.DepositAsset {
    return { type: "DepositAsset", ...value }
  }
  export function DepositReserveAsset(
    value: Omit<t.xcm.v2.Instruction.DepositReserveAsset, "type">,
  ): t.xcm.v2.Instruction.DepositReserveAsset {
    return { type: "DepositReserveAsset", ...value }
  }
  export function ExchangeAsset(
    value: Omit<t.xcm.v2.Instruction.ExchangeAsset, "type">,
  ): t.xcm.v2.Instruction.ExchangeAsset {
    return { type: "ExchangeAsset", ...value }
  }
  export function InitiateReserveWithdraw(
    value: Omit<t.xcm.v2.Instruction.InitiateReserveWithdraw, "type">,
  ): t.xcm.v2.Instruction.InitiateReserveWithdraw {
    return { type: "InitiateReserveWithdraw", ...value }
  }
  export function InitiateTeleport(
    value: Omit<t.xcm.v2.Instruction.InitiateTeleport, "type">,
  ): t.xcm.v2.Instruction.InitiateTeleport {
    return { type: "InitiateTeleport", ...value }
  }
  export function QueryHolding(
    value: Omit<t.xcm.v2.Instruction.QueryHolding, "type">,
  ): t.xcm.v2.Instruction.QueryHolding {
    return { type: "QueryHolding", ...value }
  }
  export function BuyExecution(
    value: Omit<t.xcm.v2.Instruction.BuyExecution, "type">,
  ): t.xcm.v2.Instruction.BuyExecution {
    return { type: "BuyExecution", ...value }
  }
  export function RefundSurplus(): t.xcm.v2.Instruction.RefundSurplus {
    return { type: "RefundSurplus" }
  }
  export function SetErrorHandler(
    value: t.xcm.v2.Instruction.SetErrorHandler["value"],
  ): t.xcm.v2.Instruction.SetErrorHandler {
    return { type: "SetErrorHandler", value }
  }
  export function SetAppendix(
    value: t.xcm.v2.Instruction.SetAppendix["value"],
  ): t.xcm.v2.Instruction.SetAppendix {
    return { type: "SetAppendix", value }
  }
  export function ClearError(): t.xcm.v2.Instruction.ClearError {
    return { type: "ClearError" }
  }
  export function ClaimAsset(
    value: Omit<t.xcm.v2.Instruction.ClaimAsset, "type">,
  ): t.xcm.v2.Instruction.ClaimAsset {
    return { type: "ClaimAsset", ...value }
  }
  export function Trap(value: t.xcm.v2.Instruction.Trap["value"]): t.xcm.v2.Instruction.Trap {
    return { type: "Trap", value }
  }
  export function SubscribeVersion(
    value: Omit<t.xcm.v2.Instruction.SubscribeVersion, "type">,
  ): t.xcm.v2.Instruction.SubscribeVersion {
    return { type: "SubscribeVersion", ...value }
  }
  export function UnsubscribeVersion(): t.xcm.v2.Instruction.UnsubscribeVersion {
    return { type: "UnsubscribeVersion" }
  }
}

export type Response =
  | t.xcm.v2.Response.Null
  | t.xcm.v2.Response.Assets
  | t.xcm.v2.Response.ExecutionResult
  | t.xcm.v2.Response.Version
export namespace Response {
  export interface Null {
    type: "Null"
  }
  export interface Assets {
    type: "Assets"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface ExecutionResult {
    type: "ExecutionResult"
    value: [t.u32, t.xcm.v2.traits.Error] | undefined
  }
  export interface Version {
    type: "Version"
    value: t.u32
  }
  export function Null(): t.xcm.v2.Response.Null {
    return { type: "Null" }
  }
  export function Assets(value: t.xcm.v2.Response.Assets["value"]): t.xcm.v2.Response.Assets {
    return { type: "Assets", value }
  }
  export function ExecutionResult(
    value: t.xcm.v2.Response.ExecutionResult["value"],
  ): t.xcm.v2.Response.ExecutionResult {
    return { type: "ExecutionResult", value }
  }
  export function Version(value: t.xcm.v2.Response.Version["value"]): t.xcm.v2.Response.Version {
    return { type: "Version", value }
  }
}

export type WeightLimit = t.xcm.v2.WeightLimit.Unlimited | t.xcm.v2.WeightLimit.Limited
export namespace WeightLimit {
  export interface Unlimited {
    type: "Unlimited"
  }
  export interface Limited {
    type: "Limited"
    value: t.Compact<t.u64>
  }
  export function Unlimited(): t.xcm.v2.WeightLimit.Unlimited {
    return { type: "Unlimited" }
  }
  export function Limited(
    value: t.xcm.v2.WeightLimit.Limited["value"],
  ): t.xcm.v2.WeightLimit.Limited {
    return { type: "Limited", value }
  }
}

export * as traits from "./traits.ts"
