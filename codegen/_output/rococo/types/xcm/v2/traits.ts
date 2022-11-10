import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $error: $.Codec<t.types.xcm.v2.traits.Error> = _codec.$110

export const $outcome: $.Codec<t.types.xcm.v2.traits.Outcome> = _codec.$109

export type Error =
  | t.types.xcm.v2.traits.Error.Overflow
  | t.types.xcm.v2.traits.Error.Unimplemented
  | t.types.xcm.v2.traits.Error.UntrustedReserveLocation
  | t.types.xcm.v2.traits.Error.UntrustedTeleportLocation
  | t.types.xcm.v2.traits.Error.MultiLocationFull
  | t.types.xcm.v2.traits.Error.MultiLocationNotInvertible
  | t.types.xcm.v2.traits.Error.BadOrigin
  | t.types.xcm.v2.traits.Error.InvalidLocation
  | t.types.xcm.v2.traits.Error.AssetNotFound
  | t.types.xcm.v2.traits.Error.FailedToTransactAsset
  | t.types.xcm.v2.traits.Error.NotWithdrawable
  | t.types.xcm.v2.traits.Error.LocationCannotHold
  | t.types.xcm.v2.traits.Error.ExceedsMaxMessageSize
  | t.types.xcm.v2.traits.Error.DestinationUnsupported
  | t.types.xcm.v2.traits.Error.Transport
  | t.types.xcm.v2.traits.Error.Unroutable
  | t.types.xcm.v2.traits.Error.UnknownClaim
  | t.types.xcm.v2.traits.Error.FailedToDecode
  | t.types.xcm.v2.traits.Error.MaxWeightInvalid
  | t.types.xcm.v2.traits.Error.NotHoldingFees
  | t.types.xcm.v2.traits.Error.TooExpensive
  | t.types.xcm.v2.traits.Error.Trap
  | t.types.xcm.v2.traits.Error.UnhandledXcmVersion
  | t.types.xcm.v2.traits.Error.WeightLimitReached
  | t.types.xcm.v2.traits.Error.Barrier
  | t.types.xcm.v2.traits.Error.WeightNotComputable
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
    value: t.types.u64
  }
  export interface UnhandledXcmVersion {
    type: "UnhandledXcmVersion"
  }
  export interface WeightLimitReached {
    type: "WeightLimitReached"
    value: t.types.u64
  }
  export interface Barrier {
    type: "Barrier"
  }
  export interface WeightNotComputable {
    type: "WeightNotComputable"
  }
  export function Overflow(): t.types.xcm.v2.traits.Error.Overflow {
    return { type: "Overflow" }
  }
  export function Unimplemented(): t.types.xcm.v2.traits.Error.Unimplemented {
    return { type: "Unimplemented" }
  }
  export function UntrustedReserveLocation(): t.types.xcm.v2.traits.Error.UntrustedReserveLocation {
    return { type: "UntrustedReserveLocation" }
  }
  export function UntrustedTeleportLocation(): t.types.xcm.v2.traits.Error.UntrustedTeleportLocation {
    return { type: "UntrustedTeleportLocation" }
  }
  export function MultiLocationFull(): t.types.xcm.v2.traits.Error.MultiLocationFull {
    return { type: "MultiLocationFull" }
  }
  export function MultiLocationNotInvertible(): t.types.xcm.v2.traits.Error.MultiLocationNotInvertible {
    return { type: "MultiLocationNotInvertible" }
  }
  export function BadOrigin(): t.types.xcm.v2.traits.Error.BadOrigin {
    return { type: "BadOrigin" }
  }
  export function InvalidLocation(): t.types.xcm.v2.traits.Error.InvalidLocation {
    return { type: "InvalidLocation" }
  }
  export function AssetNotFound(): t.types.xcm.v2.traits.Error.AssetNotFound {
    return { type: "AssetNotFound" }
  }
  export function FailedToTransactAsset(): t.types.xcm.v2.traits.Error.FailedToTransactAsset {
    return { type: "FailedToTransactAsset" }
  }
  export function NotWithdrawable(): t.types.xcm.v2.traits.Error.NotWithdrawable {
    return { type: "NotWithdrawable" }
  }
  export function LocationCannotHold(): t.types.xcm.v2.traits.Error.LocationCannotHold {
    return { type: "LocationCannotHold" }
  }
  export function ExceedsMaxMessageSize(): t.types.xcm.v2.traits.Error.ExceedsMaxMessageSize {
    return { type: "ExceedsMaxMessageSize" }
  }
  export function DestinationUnsupported(): t.types.xcm.v2.traits.Error.DestinationUnsupported {
    return { type: "DestinationUnsupported" }
  }
  export function Transport(): t.types.xcm.v2.traits.Error.Transport {
    return { type: "Transport" }
  }
  export function Unroutable(): t.types.xcm.v2.traits.Error.Unroutable {
    return { type: "Unroutable" }
  }
  export function UnknownClaim(): t.types.xcm.v2.traits.Error.UnknownClaim {
    return { type: "UnknownClaim" }
  }
  export function FailedToDecode(): t.types.xcm.v2.traits.Error.FailedToDecode {
    return { type: "FailedToDecode" }
  }
  export function MaxWeightInvalid(): t.types.xcm.v2.traits.Error.MaxWeightInvalid {
    return { type: "MaxWeightInvalid" }
  }
  export function NotHoldingFees(): t.types.xcm.v2.traits.Error.NotHoldingFees {
    return { type: "NotHoldingFees" }
  }
  export function TooExpensive(): t.types.xcm.v2.traits.Error.TooExpensive {
    return { type: "TooExpensive" }
  }
  export function Trap(
    value: t.types.xcm.v2.traits.Error.Trap["value"],
  ): t.types.xcm.v2.traits.Error.Trap {
    return { type: "Trap", value }
  }
  export function UnhandledXcmVersion(): t.types.xcm.v2.traits.Error.UnhandledXcmVersion {
    return { type: "UnhandledXcmVersion" }
  }
  export function WeightLimitReached(
    value: t.types.xcm.v2.traits.Error.WeightLimitReached["value"],
  ): t.types.xcm.v2.traits.Error.WeightLimitReached {
    return { type: "WeightLimitReached", value }
  }
  export function Barrier(): t.types.xcm.v2.traits.Error.Barrier {
    return { type: "Barrier" }
  }
  export function WeightNotComputable(): t.types.xcm.v2.traits.Error.WeightNotComputable {
    return { type: "WeightNotComputable" }
  }
}

export type Outcome =
  | t.types.xcm.v2.traits.Outcome.Complete
  | t.types.xcm.v2.traits.Outcome.Incomplete
  | t.types.xcm.v2.traits.Outcome.Error
export namespace Outcome {
  export interface Complete {
    type: "Complete"
    value: t.types.u64
  }
  export interface Incomplete {
    type: "Incomplete"
    value: [t.types.u64, t.types.xcm.v2.traits.Error]
  }
  export interface Error {
    type: "Error"
    value: t.types.xcm.v2.traits.Error
  }
  export function Complete(
    value: t.types.xcm.v2.traits.Outcome.Complete["value"],
  ): t.types.xcm.v2.traits.Outcome.Complete {
    return { type: "Complete", value }
  }
  export function Incomplete(
    ...value: t.types.xcm.v2.traits.Outcome.Incomplete["value"]
  ): t.types.xcm.v2.traits.Outcome.Incomplete {
    return { type: "Incomplete", value }
  }
  export function Error(
    value: t.types.xcm.v2.traits.Outcome.Error["value"],
  ): t.types.xcm.v2.traits.Outcome.Error {
    return { type: "Error", value }
  }
}
