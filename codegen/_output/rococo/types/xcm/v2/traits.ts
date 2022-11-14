import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type Error =
  | types.xcm.v2.traits.Error.Overflow
  | types.xcm.v2.traits.Error.Unimplemented
  | types.xcm.v2.traits.Error.UntrustedReserveLocation
  | types.xcm.v2.traits.Error.UntrustedTeleportLocation
  | types.xcm.v2.traits.Error.MultiLocationFull
  | types.xcm.v2.traits.Error.MultiLocationNotInvertible
  | types.xcm.v2.traits.Error.BadOrigin
  | types.xcm.v2.traits.Error.InvalidLocation
  | types.xcm.v2.traits.Error.AssetNotFound
  | types.xcm.v2.traits.Error.FailedToTransactAsset
  | types.xcm.v2.traits.Error.NotWithdrawable
  | types.xcm.v2.traits.Error.LocationCannotHold
  | types.xcm.v2.traits.Error.ExceedsMaxMessageSize
  | types.xcm.v2.traits.Error.DestinationUnsupported
  | types.xcm.v2.traits.Error.Transport
  | types.xcm.v2.traits.Error.Unroutable
  | types.xcm.v2.traits.Error.UnknownClaim
  | types.xcm.v2.traits.Error.FailedToDecode
  | types.xcm.v2.traits.Error.MaxWeightInvalid
  | types.xcm.v2.traits.Error.NotHoldingFees
  | types.xcm.v2.traits.Error.TooExpensive
  | types.xcm.v2.traits.Error.Trap
  | types.xcm.v2.traits.Error.UnhandledXcmVersion
  | types.xcm.v2.traits.Error.WeightLimitReached
  | types.xcm.v2.traits.Error.Barrier
  | types.xcm.v2.traits.Error.WeightNotComputable
export namespace Error {
  export interface Overflow {
    type: "Overflow"
  }
  export interface Unimplemented {
    type: "Unimplemented"
  }
  export interface UntrustedReserveLocation {
    type: "UntrustedReserveLocation"
  }
  export interface UntrustedTeleportLocation {
    type: "UntrustedTeleportLocation"
  }
  export interface MultiLocationFull {
    type: "MultiLocationFull"
  }
  export interface MultiLocationNotInvertible {
    type: "MultiLocationNotInvertible"
  }
  export interface BadOrigin {
    type: "BadOrigin"
  }
  export interface InvalidLocation {
    type: "InvalidLocation"
  }
  export interface AssetNotFound {
    type: "AssetNotFound"
  }
  export interface FailedToTransactAsset {
    type: "FailedToTransactAsset"
  }
  export interface NotWithdrawable {
    type: "NotWithdrawable"
  }
  export interface LocationCannotHold {
    type: "LocationCannotHold"
  }
  export interface ExceedsMaxMessageSize {
    type: "ExceedsMaxMessageSize"
  }
  export interface DestinationUnsupported {
    type: "DestinationUnsupported"
  }
  export interface Transport {
    type: "Transport"
  }
  export interface Unroutable {
    type: "Unroutable"
  }
  export interface UnknownClaim {
    type: "UnknownClaim"
  }
  export interface FailedToDecode {
    type: "FailedToDecode"
  }
  export interface MaxWeightInvalid {
    type: "MaxWeightInvalid"
  }
  export interface NotHoldingFees {
    type: "NotHoldingFees"
  }
  export interface TooExpensive {
    type: "TooExpensive"
  }
  export interface Trap {
    type: "Trap"
    value: types.u64
  }
  export interface UnhandledXcmVersion {
    type: "UnhandledXcmVersion"
  }
  export interface WeightLimitReached {
    type: "WeightLimitReached"
    value: types.u64
  }
  export interface Barrier {
    type: "Barrier"
  }
  export interface WeightNotComputable {
    type: "WeightNotComputable"
  }
  export function Overflow(): types.xcm.v2.traits.Error.Overflow {
    return { type: "Overflow" }
  }
  export function Unimplemented(): types.xcm.v2.traits.Error.Unimplemented {
    return { type: "Unimplemented" }
  }
  export function UntrustedReserveLocation(): types.xcm.v2.traits.Error.UntrustedReserveLocation {
    return { type: "UntrustedReserveLocation" }
  }
  export function UntrustedTeleportLocation(): types.xcm.v2.traits.Error.UntrustedTeleportLocation {
    return { type: "UntrustedTeleportLocation" }
  }
  export function MultiLocationFull(): types.xcm.v2.traits.Error.MultiLocationFull {
    return { type: "MultiLocationFull" }
  }
  export function MultiLocationNotInvertible(): types.xcm.v2.traits.Error.MultiLocationNotInvertible {
    return { type: "MultiLocationNotInvertible" }
  }
  export function BadOrigin(): types.xcm.v2.traits.Error.BadOrigin {
    return { type: "BadOrigin" }
  }
  export function InvalidLocation(): types.xcm.v2.traits.Error.InvalidLocation {
    return { type: "InvalidLocation" }
  }
  export function AssetNotFound(): types.xcm.v2.traits.Error.AssetNotFound {
    return { type: "AssetNotFound" }
  }
  export function FailedToTransactAsset(): types.xcm.v2.traits.Error.FailedToTransactAsset {
    return { type: "FailedToTransactAsset" }
  }
  export function NotWithdrawable(): types.xcm.v2.traits.Error.NotWithdrawable {
    return { type: "NotWithdrawable" }
  }
  export function LocationCannotHold(): types.xcm.v2.traits.Error.LocationCannotHold {
    return { type: "LocationCannotHold" }
  }
  export function ExceedsMaxMessageSize(): types.xcm.v2.traits.Error.ExceedsMaxMessageSize {
    return { type: "ExceedsMaxMessageSize" }
  }
  export function DestinationUnsupported(): types.xcm.v2.traits.Error.DestinationUnsupported {
    return { type: "DestinationUnsupported" }
  }
  export function Transport(): types.xcm.v2.traits.Error.Transport {
    return { type: "Transport" }
  }
  export function Unroutable(): types.xcm.v2.traits.Error.Unroutable {
    return { type: "Unroutable" }
  }
  export function UnknownClaim(): types.xcm.v2.traits.Error.UnknownClaim {
    return { type: "UnknownClaim" }
  }
  export function FailedToDecode(): types.xcm.v2.traits.Error.FailedToDecode {
    return { type: "FailedToDecode" }
  }
  export function MaxWeightInvalid(): types.xcm.v2.traits.Error.MaxWeightInvalid {
    return { type: "MaxWeightInvalid" }
  }
  export function NotHoldingFees(): types.xcm.v2.traits.Error.NotHoldingFees {
    return { type: "NotHoldingFees" }
  }
  export function TooExpensive(): types.xcm.v2.traits.Error.TooExpensive {
    return { type: "TooExpensive" }
  }
  export function Trap(
    value: types.xcm.v2.traits.Error.Trap["value"],
  ): types.xcm.v2.traits.Error.Trap {
    return { type: "Trap", value }
  }
  export function UnhandledXcmVersion(): types.xcm.v2.traits.Error.UnhandledXcmVersion {
    return { type: "UnhandledXcmVersion" }
  }
  export function WeightLimitReached(
    value: types.xcm.v2.traits.Error.WeightLimitReached["value"],
  ): types.xcm.v2.traits.Error.WeightLimitReached {
    return { type: "WeightLimitReached", value }
  }
  export function Barrier(): types.xcm.v2.traits.Error.Barrier {
    return { type: "Barrier" }
  }
  export function WeightNotComputable(): types.xcm.v2.traits.Error.WeightNotComputable {
    return { type: "WeightNotComputable" }
  }
}

export type Outcome =
  | types.xcm.v2.traits.Outcome.Complete
  | types.xcm.v2.traits.Outcome.Incomplete
  | types.xcm.v2.traits.Outcome.Error
export namespace Outcome {
  export interface Complete {
    type: "Complete"
    value: types.u64
  }
  export interface Incomplete {
    type: "Incomplete"
    value: [types.u64, types.xcm.v2.traits.Error]
  }
  export interface Error {
    type: "Error"
    value: types.xcm.v2.traits.Error
  }
  export function Complete(
    value: types.xcm.v2.traits.Outcome.Complete["value"],
  ): types.xcm.v2.traits.Outcome.Complete {
    return { type: "Complete", value }
  }
  export function Incomplete(
    ...value: types.xcm.v2.traits.Outcome.Incomplete["value"]
  ): types.xcm.v2.traits.Outcome.Incomplete {
    return { type: "Incomplete", value }
  }
  export function Error(
    value: types.xcm.v2.traits.Outcome.Error["value"],
  ): types.xcm.v2.traits.Outcome.Error {
    return { type: "Error", value }
  }
}
