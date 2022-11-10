import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $assetId: $.Codec<t.types.xcm.v1.multiasset.AssetId> = _codec.$136

export const $assetInstance: $.Codec<t.types.xcm.v1.multiasset.AssetInstance> = _codec.$138

export const $fungibility: $.Codec<t.types.xcm.v1.multiasset.Fungibility> = _codec.$137

export const $multiAsset: $.Codec<t.types.xcm.v1.multiasset.MultiAsset> = _codec.$135

export const $multiAssetFilter: $.Codec<t.types.xcm.v1.multiasset.MultiAssetFilter> = _codec.$145

export const $multiAssets: $.Codec<t.types.xcm.v1.multiasset.MultiAssets> = _codec.$133

export const $wildFungibility: $.Codec<t.types.xcm.v1.multiasset.WildFungibility> = _codec.$147

export const $wildMultiAsset: $.Codec<t.types.xcm.v1.multiasset.WildMultiAsset> = _codec.$146

export type AssetId =
  | t.types.xcm.v1.multiasset.AssetId.Concrete
  | t.types.xcm.v1.multiasset.AssetId.Abstract
export namespace AssetId {
  export interface Concrete {
    type: "Concrete"
    value: t.types.xcm.v1.multilocation.MultiLocation
  }
  export interface Abstract {
    type: "Abstract"
    value: Uint8Array
  }
  export function Concrete(
    value: t.types.xcm.v1.multiasset.AssetId.Concrete["value"],
  ): t.types.xcm.v1.multiasset.AssetId.Concrete {
    return { type: "Concrete", value }
  }
  export function Abstract(
    value: t.types.xcm.v1.multiasset.AssetId.Abstract["value"],
  ): t.types.xcm.v1.multiasset.AssetId.Abstract {
    return { type: "Abstract", value }
  }
}

export type AssetInstance =
  | t.types.xcm.v1.multiasset.AssetInstance.Undefined
  | t.types.xcm.v1.multiasset.AssetInstance.Index
  | t.types.xcm.v1.multiasset.AssetInstance.Array4
  | t.types.xcm.v1.multiasset.AssetInstance.Array8
  | t.types.xcm.v1.multiasset.AssetInstance.Array16
  | t.types.xcm.v1.multiasset.AssetInstance.Array32
  | t.types.xcm.v1.multiasset.AssetInstance.Blob
export namespace AssetInstance {
  export interface Undefined {
    type: "Undefined"
  }
  export interface Index {
    type: "Index"
    value: t.Compact<t.types.u128>
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
  export function Undefined(): t.types.xcm.v1.multiasset.AssetInstance.Undefined {
    return { type: "Undefined" }
  }
  export function Index(
    value: t.types.xcm.v1.multiasset.AssetInstance.Index["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Index {
    return { type: "Index", value }
  }
  export function Array4(
    value: t.types.xcm.v1.multiasset.AssetInstance.Array4["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Array4 {
    return { type: "Array4", value }
  }
  export function Array8(
    value: t.types.xcm.v1.multiasset.AssetInstance.Array8["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Array8 {
    return { type: "Array8", value }
  }
  export function Array16(
    value: t.types.xcm.v1.multiasset.AssetInstance.Array16["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Array16 {
    return { type: "Array16", value }
  }
  export function Array32(
    value: t.types.xcm.v1.multiasset.AssetInstance.Array32["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Array32 {
    return { type: "Array32", value }
  }
  export function Blob(
    value: t.types.xcm.v1.multiasset.AssetInstance.Blob["value"],
  ): t.types.xcm.v1.multiasset.AssetInstance.Blob {
    return { type: "Blob", value }
  }
}

export type Fungibility =
  | t.types.xcm.v1.multiasset.Fungibility.Fungible
  | t.types.xcm.v1.multiasset.Fungibility.NonFungible
export namespace Fungibility {
  export interface Fungible {
    type: "Fungible"
    value: t.Compact<t.types.u128>
  }
  export interface NonFungible {
    type: "NonFungible"
    value: t.types.xcm.v1.multiasset.AssetInstance
  }
  export function Fungible(
    value: t.types.xcm.v1.multiasset.Fungibility.Fungible["value"],
  ): t.types.xcm.v1.multiasset.Fungibility.Fungible {
    return { type: "Fungible", value }
  }
  export function NonFungible(
    value: t.types.xcm.v1.multiasset.Fungibility.NonFungible["value"],
  ): t.types.xcm.v1.multiasset.Fungibility.NonFungible {
    return { type: "NonFungible", value }
  }
}

export interface MultiAsset {
  id: t.types.xcm.v1.multiasset.AssetId
  fun: t.types.xcm.v1.multiasset.Fungibility
}

export function MultiAsset(value: t.types.xcm.v1.multiasset.MultiAsset) {
  return value
}

export type MultiAssetFilter =
  | t.types.xcm.v1.multiasset.MultiAssetFilter.Definite
  | t.types.xcm.v1.multiasset.MultiAssetFilter.Wild
export namespace MultiAssetFilter {
  export interface Definite {
    type: "Definite"
    value: t.types.xcm.v1.multiasset.MultiAssets
  }
  export interface Wild {
    type: "Wild"
    value: t.types.xcm.v1.multiasset.WildMultiAsset
  }
  export function Definite(
    value: t.types.xcm.v1.multiasset.MultiAssetFilter.Definite["value"],
  ): t.types.xcm.v1.multiasset.MultiAssetFilter.Definite {
    return { type: "Definite", value }
  }
  export function Wild(
    value: t.types.xcm.v1.multiasset.MultiAssetFilter.Wild["value"],
  ): t.types.xcm.v1.multiasset.MultiAssetFilter.Wild {
    return { type: "Wild", value }
  }
}

export type MultiAssets = Array<t.types.xcm.v1.multiasset.MultiAsset>

export function MultiAssets(value: t.types.xcm.v1.multiasset.MultiAssets) {
  return value
}

export type WildFungibility = "Fungible" | "NonFungible"

export type WildMultiAsset =
  | t.types.xcm.v1.multiasset.WildMultiAsset.All
  | t.types.xcm.v1.multiasset.WildMultiAsset.AllOf
export namespace WildMultiAsset {
  export interface All {
    type: "All"
  }
  export interface AllOf {
    type: "AllOf"
    id: t.types.xcm.v1.multiasset.AssetId
    fun: t.types.xcm.v1.multiasset.WildFungibility
  }
  export function All(): t.types.xcm.v1.multiasset.WildMultiAsset.All {
    return { type: "All" }
  }
  export function AllOf(
    value: Omit<t.types.xcm.v1.multiasset.WildMultiAsset.AllOf, "type">,
  ): t.types.xcm.v1.multiasset.WildMultiAsset.AllOf {
    return { type: "AllOf", ...value }
  }
}
