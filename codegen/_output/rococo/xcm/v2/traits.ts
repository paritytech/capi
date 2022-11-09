import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $error: $.Codec<t.xcm.v2.traits.Error> = _codec.$110

export const $outcome: $.Codec<t.xcm.v2.traits.Outcome> = _codec.$109

export type Error =
  | t.xcm.v2.traits.Error.Overflow
  | t.xcm.v2.traits.Error.Unimplemented
  | t.xcm.v2.traits.Error.UntrustedReserveLocation
  | t.xcm.v2.traits.Error.UntrustedTeleportLocation
  | t.xcm.v2.traits.Error.MultiLocationFull
  | t.xcm.v2.traits.Error.MultiLocationNotInvertible
  | t.xcm.v2.traits.Error.BadOrigin
  | t.xcm.v2.traits.Error.InvalidLocation
  | t.xcm.v2.traits.Error.AssetNotFound
  | t.xcm.v2.traits.Error.FailedToTransactAsset
  | t.xcm.v2.traits.Error.NotWithdrawable
  | t.xcm.v2.traits.Error.LocationCannotHold
  | t.xcm.v2.traits.Error.ExceedsMaxMessageSize
  | t.xcm.v2.traits.Error.DestinationUnsupported
  | t.xcm.v2.traits.Error.Transport
  | t.xcm.v2.traits.Error.Unroutable
  | t.xcm.v2.traits.Error.UnknownClaim
  | t.xcm.v2.traits.Error.FailedToDecode
  | t.xcm.v2.traits.Error.MaxWeightInvalid
  | t.xcm.v2.traits.Error.NotHoldingFees
  | t.xcm.v2.traits.Error.TooExpensive
  | t.xcm.v2.traits.Error.Trap
  | t.xcm.v2.traits.Error.UnhandledXcmVersion
  | t.xcm.v2.traits.Error.WeightLimitReached
  | t.xcm.v2.traits.Error.Barrier
  | t.xcm.v2.traits.Error.WeightNotComputable
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
    value: t.u64
  }
  export interface UnhandledXcmVersion {
    type: "UnhandledXcmVersion"
  }
  export interface WeightLimitReached {
    type: "WeightLimitReached"
    value: t.u64
  }
  export interface Barrier {
    type: "Barrier"
  }
  export interface WeightNotComputable {
    type: "WeightNotComputable"
  }
  export function Overflow(): t.xcm.v2.traits.Error.Overflow {
    return { type: "Overflow" }
  }
  export function Unimplemented(): t.xcm.v2.traits.Error.Unimplemented {
    return { type: "Unimplemented" }
  }
  export function UntrustedReserveLocation(): t.xcm.v2.traits.Error.UntrustedReserveLocation {
    return { type: "UntrustedReserveLocation" }
  }
  export function UntrustedTeleportLocation(): t.xcm.v2.traits.Error.UntrustedTeleportLocation {
    return { type: "UntrustedTeleportLocation" }
  }
  export function MultiLocationFull(): t.xcm.v2.traits.Error.MultiLocationFull {
    return { type: "MultiLocationFull" }
  }
  export function MultiLocationNotInvertible(): t.xcm.v2.traits.Error.MultiLocationNotInvertible {
    return { type: "MultiLocationNotInvertible" }
  }
  export function BadOrigin(): t.xcm.v2.traits.Error.BadOrigin {
    return { type: "BadOrigin" }
  }
  export function InvalidLocation(): t.xcm.v2.traits.Error.InvalidLocation {
    return { type: "InvalidLocation" }
  }
  export function AssetNotFound(): t.xcm.v2.traits.Error.AssetNotFound {
    return { type: "AssetNotFound" }
  }
  export function FailedToTransactAsset(): t.xcm.v2.traits.Error.FailedToTransactAsset {
    return { type: "FailedToTransactAsset" }
  }
  export function NotWithdrawable(): t.xcm.v2.traits.Error.NotWithdrawable {
    return { type: "NotWithdrawable" }
  }
  export function LocationCannotHold(): t.xcm.v2.traits.Error.LocationCannotHold {
    return { type: "LocationCannotHold" }
  }
  export function ExceedsMaxMessageSize(): t.xcm.v2.traits.Error.ExceedsMaxMessageSize {
    return { type: "ExceedsMaxMessageSize" }
  }
  export function DestinationUnsupported(): t.xcm.v2.traits.Error.DestinationUnsupported {
    return { type: "DestinationUnsupported" }
  }
  export function Transport(): t.xcm.v2.traits.Error.Transport {
    return { type: "Transport" }
  }
  export function Unroutable(): t.xcm.v2.traits.Error.Unroutable {
    return { type: "Unroutable" }
  }
  export function UnknownClaim(): t.xcm.v2.traits.Error.UnknownClaim {
    return { type: "UnknownClaim" }
  }
  export function FailedToDecode(): t.xcm.v2.traits.Error.FailedToDecode {
    return { type: "FailedToDecode" }
  }
  export function MaxWeightInvalid(): t.xcm.v2.traits.Error.MaxWeightInvalid {
    return { type: "MaxWeightInvalid" }
  }
  export function NotHoldingFees(): t.xcm.v2.traits.Error.NotHoldingFees {
    return { type: "NotHoldingFees" }
  }
  export function TooExpensive(): t.xcm.v2.traits.Error.TooExpensive {
    return { type: "TooExpensive" }
  }
  export function Trap(value: t.xcm.v2.traits.Error.Trap["value"]): t.xcm.v2.traits.Error.Trap {
    return { type: "Trap", value }
  }
  export function UnhandledXcmVersion(): t.xcm.v2.traits.Error.UnhandledXcmVersion {
    return { type: "UnhandledXcmVersion" }
  }
  export function WeightLimitReached(
    value: t.xcm.v2.traits.Error.WeightLimitReached["value"],
  ): t.xcm.v2.traits.Error.WeightLimitReached {
    return { type: "WeightLimitReached", value }
  }
  export function Barrier(): t.xcm.v2.traits.Error.Barrier {
    return { type: "Barrier" }
  }
  export function WeightNotComputable(): t.xcm.v2.traits.Error.WeightNotComputable {
    return { type: "WeightNotComputable" }
  }
}

export type Outcome =
  | t.xcm.v2.traits.Outcome.Complete
  | t.xcm.v2.traits.Outcome.Incomplete
  | t.xcm.v2.traits.Outcome.Error
export namespace Outcome {
  export interface Complete {
    type: "Complete"
    value: t.u64
  }
  export interface Incomplete {
    type: "Incomplete"
    value: [t.u64, t.xcm.v2.traits.Error]
  }
  export interface Error {
    type: "Error"
    value: t.xcm.v2.traits.Error
  }
  export function Complete(
    value: t.xcm.v2.traits.Outcome.Complete["value"],
  ): t.xcm.v2.traits.Outcome.Complete {
    return { type: "Complete", value }
  }
  export function Incomplete(
    ...value: t.xcm.v2.traits.Outcome.Incomplete["value"]
  ): t.xcm.v2.traits.Outcome.Incomplete {
    return { type: "Incomplete", value }
  }
  export function Error(
    value: t.xcm.v2.traits.Outcome.Error["value"],
  ): t.xcm.v2.traits.Outcome.Error {
    return { type: "Error", value }
  }
}
