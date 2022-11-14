import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as double_encoded from "./double_encoded.ts"
export * as v0 from "./v0/mod.ts"
export * as v1 from "./v1/mod.ts"
export * as v2 from "./v2/mod.ts"

export type VersionedMultiAssets =
  | types.xcm.VersionedMultiAssets.V0
  | types.xcm.VersionedMultiAssets.V1
export namespace VersionedMultiAssets {
  export interface V0 {
    type: "V0"
    value: Array<types.xcm.v0.multi_asset.MultiAsset>
  }
  export interface V1 {
    type: "V1"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export function V0(
    value: types.xcm.VersionedMultiAssets.V0["value"],
  ): types.xcm.VersionedMultiAssets.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: types.xcm.VersionedMultiAssets.V1["value"],
  ): types.xcm.VersionedMultiAssets.V1 {
    return { type: "V1", value }
  }
}

export type VersionedMultiLocation =
  | types.xcm.VersionedMultiLocation.V0
  | types.xcm.VersionedMultiLocation.V1
export namespace VersionedMultiLocation {
  export interface V0 {
    type: "V0"
    value: types.xcm.v0.multi_location.MultiLocation
  }
  export interface V1 {
    type: "V1"
    value: types.xcm.v1.multilocation.MultiLocation
  }
  export function V0(
    value: types.xcm.VersionedMultiLocation.V0["value"],
  ): types.xcm.VersionedMultiLocation.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: types.xcm.VersionedMultiLocation.V1["value"],
  ): types.xcm.VersionedMultiLocation.V1 {
    return { type: "V1", value }
  }
}

export type VersionedResponse =
  | types.xcm.VersionedResponse.V0
  | types.xcm.VersionedResponse.V1
  | types.xcm.VersionedResponse.V2
export namespace VersionedResponse {
  export interface V0 {
    type: "V0"
    value: types.xcm.v0.Response
  }
  export interface V1 {
    type: "V1"
    value: types.xcm.v1.Response
  }
  export interface V2 {
    type: "V2"
    value: types.xcm.v2.Response
  }
  export function V0(
    value: types.xcm.VersionedResponse.V0["value"],
  ): types.xcm.VersionedResponse.V0 {
    return { type: "V0", value }
  }
  export function V1(
    value: types.xcm.VersionedResponse.V1["value"],
  ): types.xcm.VersionedResponse.V1 {
    return { type: "V1", value }
  }
  export function V2(
    value: types.xcm.VersionedResponse.V2["value"],
  ): types.xcm.VersionedResponse.V2 {
    return { type: "V2", value }
  }
}

export type VersionedXcm =
  | types.xcm.VersionedXcm.V0
  | types.xcm.VersionedXcm.V1
  | types.xcm.VersionedXcm.V2
export namespace VersionedXcm {
  export interface V0 {
    type: "V0"
    value: types.xcm.v0.Xcm
  }
  export interface V1 {
    type: "V1"
    value: types.xcm.v1.Xcm
  }
  export interface V2 {
    type: "V2"
    value: types.xcm.v2.Xcm
  }
  export function V0(value: types.xcm.VersionedXcm.V0["value"]): types.xcm.VersionedXcm.V0 {
    return { type: "V0", value }
  }
  export function V1(value: types.xcm.VersionedXcm.V1["value"]): types.xcm.VersionedXcm.V1 {
    return { type: "V1", value }
  }
  export function V2(value: types.xcm.VersionedXcm.V2["value"]): types.xcm.VersionedXcm.V2 {
    return { type: "V2", value }
  }
}
