import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $assetId: $.Codec<types.xcm.v1.multiasset.AssetId> = _codec.$136

export const $assetInstance: $.Codec<types.xcm.v1.multiasset.AssetInstance> = _codec.$138

export const $fungibility: $.Codec<types.xcm.v1.multiasset.Fungibility> = _codec.$137

export const $multiAsset: $.Codec<types.xcm.v1.multiasset.MultiAsset> = _codec.$135

export const $multiAssetFilter: $.Codec<types.xcm.v1.multiasset.MultiAssetFilter> = _codec.$145

export const $multiAssets: $.Codec<types.xcm.v1.multiasset.MultiAssets> = _codec.$133

export const $wildFungibility: $.Codec<types.xcm.v1.multiasset.WildFungibility> = _codec.$147

export const $wildMultiAsset: $.Codec<types.xcm.v1.multiasset.WildMultiAsset> = _codec.$146

export type AssetId =
  | types.xcm.v1.multiasset.AssetId.Concrete
  | types.xcm.v1.multiasset.AssetId.Abstract
export namespace AssetId {
  export interface Concrete {
    type: "Concrete"
    value: types.xcm.v1.multilocation.MultiLocation
  }
  export interface Abstract {
    type: "Abstract"
    value: Uint8Array
  }
  export function Concrete(
    value: types.xcm.v1.multiasset.AssetId.Concrete["value"],
  ): types.xcm.v1.multiasset.AssetId.Concrete {
    return { type: "Concrete", value }
  }
  export function Abstract(
    value: types.xcm.v1.multiasset.AssetId.Abstract["value"],
  ): types.xcm.v1.multiasset.AssetId.Abstract {
    return { type: "Abstract", value }
  }
}

export type AssetInstance =
  | types.xcm.v1.multiasset.AssetInstance.Undefined
  | types.xcm.v1.multiasset.AssetInstance.Index
  | types.xcm.v1.multiasset.AssetInstance.Array4
  | types.xcm.v1.multiasset.AssetInstance.Array8
  | types.xcm.v1.multiasset.AssetInstance.Array16
  | types.xcm.v1.multiasset.AssetInstance.Array32
  | types.xcm.v1.multiasset.AssetInstance.Blob
export namespace AssetInstance {
  export interface Undefined {
    type: "Undefined"
  }
  export interface Index {
    type: "Index"
    value: types.Compact<types.u128>
  }
  export interface Array4 {
    type: "Array4"
    value: Uint8Array
  }
  export interface Array8 {
    type: "Array8"
    value: Uint8Array
  }
  export interface Array16 {
    type: "Array16"
    value: Uint8Array
  }
  export interface Array32 {
    type: "Array32"
    value: Uint8Array
  }
  export interface Blob {
    type: "Blob"
    value: Uint8Array
  }
  export function Undefined(): types.xcm.v1.multiasset.AssetInstance.Undefined {
    return { type: "Undefined" }
  }
  export function Index(
    value: types.xcm.v1.multiasset.AssetInstance.Index["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Index {
    return { type: "Index", value }
  }
  export function Array4(
    value: types.xcm.v1.multiasset.AssetInstance.Array4["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Array4 {
    return { type: "Array4", value }
  }
  export function Array8(
    value: types.xcm.v1.multiasset.AssetInstance.Array8["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Array8 {
    return { type: "Array8", value }
  }
  export function Array16(
    value: types.xcm.v1.multiasset.AssetInstance.Array16["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Array16 {
    return { type: "Array16", value }
  }
  export function Array32(
    value: types.xcm.v1.multiasset.AssetInstance.Array32["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Array32 {
    return { type: "Array32", value }
  }
  export function Blob(
    value: types.xcm.v1.multiasset.AssetInstance.Blob["value"],
  ): types.xcm.v1.multiasset.AssetInstance.Blob {
    return { type: "Blob", value }
  }
}

export type Fungibility =
  | types.xcm.v1.multiasset.Fungibility.Fungible
  | types.xcm.v1.multiasset.Fungibility.NonFungible
export namespace Fungibility {
  export interface Fungible {
    type: "Fungible"
    value: types.Compact<types.u128>
  }
  export interface NonFungible {
    type: "NonFungible"
    value: types.xcm.v1.multiasset.AssetInstance
  }
  export function Fungible(
    value: types.xcm.v1.multiasset.Fungibility.Fungible["value"],
  ): types.xcm.v1.multiasset.Fungibility.Fungible {
    return { type: "Fungible", value }
  }
  export function NonFungible(
    value: types.xcm.v1.multiasset.Fungibility.NonFungible["value"],
  ): types.xcm.v1.multiasset.Fungibility.NonFungible {
    return { type: "NonFungible", value }
  }
}

export interface MultiAsset {
  id: types.xcm.v1.multiasset.AssetId
  fun: types.xcm.v1.multiasset.Fungibility
}

export function MultiAsset(value: types.xcm.v1.multiasset.MultiAsset) {
  return value
}

export type MultiAssetFilter =
  | types.xcm.v1.multiasset.MultiAssetFilter.Definite
  | types.xcm.v1.multiasset.MultiAssetFilter.Wild
export namespace MultiAssetFilter {
  export interface Definite {
    type: "Definite"
    value: types.xcm.v1.multiasset.MultiAssets
  }
  export interface Wild {
    type: "Wild"
    value: types.xcm.v1.multiasset.WildMultiAsset
  }
  export function Definite(
    value: types.xcm.v1.multiasset.MultiAssetFilter.Definite["value"],
  ): types.xcm.v1.multiasset.MultiAssetFilter.Definite {
    return { type: "Definite", value }
  }
  export function Wild(
    value: types.xcm.v1.multiasset.MultiAssetFilter.Wild["value"],
  ): types.xcm.v1.multiasset.MultiAssetFilter.Wild {
    return { type: "Wild", value }
  }
}

export type MultiAssets = Array<types.xcm.v1.multiasset.MultiAsset>

export function MultiAssets(value: types.xcm.v1.multiasset.MultiAssets) {
  return value
}

export type WildFungibility = "Fungible" | "NonFungible"

export type WildMultiAsset =
  | types.xcm.v1.multiasset.WildMultiAsset.All
  | types.xcm.v1.multiasset.WildMultiAsset.AllOf
export namespace WildMultiAsset {
  export interface All {
    type: "All"
  }
  export interface AllOf {
    type: "AllOf"
    id: types.xcm.v1.multiasset.AssetId
    fun: types.xcm.v1.multiasset.WildFungibility
  }
  export function All(): types.xcm.v1.multiasset.WildMultiAsset.All {
    return { type: "All" }
  }
  export function AllOf(
    value: Omit<types.xcm.v1.multiasset.WildMultiAsset.AllOf, "type">,
  ): types.xcm.v1.multiasset.WildMultiAsset.AllOf {
    return { type: "AllOf", ...value }
  }
}
