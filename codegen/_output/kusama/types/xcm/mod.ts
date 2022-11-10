import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as v0 from "./v0/mod.ts"
export * as v1 from "./v1/mod.ts"
export * as v2 from "./v2/mod.ts"

export const $versionedMultiAssets: $.Codec<t.types.xcm.VersionedMultiAssets> = _codec.$150

export const $versionedMultiLocation: $.Codec<t.types.xcm.VersionedMultiLocation> = _codec.$155

export const $versionedResponse: $.Codec<t.types.xcm.VersionedResponse> = _codec.$716

export const $versionedXcm: $.Codec<t.types.xcm.VersionedXcm> = _codec.$424

export type VersionedMultiAssets =
  | t.types.xcm.VersionedMultiAssets.V0
  | t.types.xcm.VersionedMultiAssets.V1
export namespace VersionedMultiAssets {
  export interface V0 {
    type: "V0"
    value: Array<t.types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface V1 {
    type: "V1"
    value: t.types.xcm.v1.multiasset.MultiAssets
  }
  export function V0(
    value: t.types.xcm.VersionedMultiAssets.V0["value"],
  ): t.types.xcm.VersionedMultiAssets.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: t.types.xcm.VersionedMultiAssets.V1["value"],
  ): t.types.xcm.VersionedMultiAssets.V1 {
    return { type: "V1", value }
  }
}

export type VersionedMultiLocation =
  | t.types.xcm.VersionedMultiLocation.V0
  | t.types.xcm.VersionedMultiLocation.V1
export namespace VersionedMultiLocation {
  export interface V0 {
    type: "V0"
    value: t.types.xcm.v0.multi_location.MultiLocation
  }
  export interface V1 {
    type: "V1"
    value: t.types.xcm.v1.multilocation.MultiLocation
  }
  export function V0(
    value: t.types.xcm.VersionedMultiLocation.V0["value"],
  ): t.types.xcm.VersionedMultiLocation.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: t.types.xcm.VersionedMultiLocation.V1["value"],
  ): t.types.xcm.VersionedMultiLocation.V1 {
    return { type: "V1", value }
  }
}

export type VersionedResponse =
  | t.types.xcm.VersionedResponse.V0
  | t.types.xcm.VersionedResponse.V1
  | t.types.xcm.VersionedResponse.V2
export namespace VersionedResponse {
  export interface V0 {
    type: "V0"
    value: t.types.xcm.v0.Response
  }
  export interface V1 {
    type: "V1"
    value: t.types.xcm.v1.Response
  }
  export interface V2 {
    type: "V2"
    value: t.types.xcm.v2.Response
  }
  export function V0(
    value: t.types.xcm.VersionedResponse.V0["value"],
  ): t.types.xcm.VersionedResponse.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: t.types.xcm.VersionedResponse.V1["value"],
  ): t.types.xcm.VersionedResponse.V1 {
    return { type: "V1", value }
  }
  export function V2(
    value: t.types.xcm.VersionedResponse.V2["value"],
  ): t.types.xcm.VersionedResponse.V2 {
    return { type: "V2", value }
  }
}

export type VersionedXcm =
  | t.types.xcm.VersionedXcm.V0
  | t.types.xcm.VersionedXcm.V1
  | t.types.xcm.VersionedXcm.V2
export namespace VersionedXcm {
  export interface V0 {
    type: "V0"
    value: t.types.xcm.v0.Xcm
  }
  export interface V1 {
    type: "V1"
    value: t.types.xcm.v1.Xcm
  }
  export interface V2 {
    type: "V2"
    value: Array<t.types.xcm.v2.Instruction>
  }
  export function V0(value: t.types.xcm.VersionedXcm.V0["value"]): t.types.xcm.VersionedXcm.V0 {
    return { type: "V0", value }
  }
  export function V1(value: t.types.xcm.VersionedXcm.V1["value"]): t.types.xcm.VersionedXcm.V1 {
    return { type: "V1", value }
  }
  export function V2(value: t.types.xcm.VersionedXcm.V2["value"]): t.types.xcm.VersionedXcm.V2 {
    return { type: "V2", value }
  }
}
