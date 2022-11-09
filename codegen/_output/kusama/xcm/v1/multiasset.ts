import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $assetId: $.Codec<t.xcm.v1.multiasset.AssetId> = _codec.$136

export const $assetInstance: $.Codec<t.xcm.v1.multiasset.AssetInstance> = _codec.$138

export const $fungibility: $.Codec<t.xcm.v1.multiasset.Fungibility> = _codec.$137

export const $multiAsset: $.Codec<t.xcm.v1.multiasset.MultiAsset> = _codec.$135

export const $multiAssetFilter: $.Codec<t.xcm.v1.multiasset.MultiAssetFilter> = _codec.$145

export const $multiAssets: $.Codec<t.xcm.v1.multiasset.MultiAssets> = _codec.$133

export const $wildFungibility: $.Codec<t.xcm.v1.multiasset.WildFungibility> = _codec.$147

export const $wildMultiAsset: $.Codec<t.xcm.v1.multiasset.WildMultiAsset> = _codec.$146

export type AssetId = t.xcm.v1.multiasset.AssetId.Concrete | t.xcm.v1.multiasset.AssetId.Abstract
export namespace AssetId {
  export interface Concrete {
    type: "Concrete"
    value: t.xcm.v1.multilocation.MultiLocation
  }
  export interface Abstract {
    type: "Abstract"
    value: Uint8Array
  }
  export function Concrete(
    value: t.xcm.v1.multiasset.AssetId.Concrete["value"],
  ): t.xcm.v1.multiasset.AssetId.Concrete {
    return { type: "Concrete", value }
  }
  export function Abstract(
    value: t.xcm.v1.multiasset.AssetId.Abstract["value"],
  ): t.xcm.v1.multiasset.AssetId.Abstract {
    return { type: "Abstract", value }
  }
}

export type AssetInstance =
  | t.xcm.v1.multiasset.AssetInstance.Undefined
  | t.xcm.v1.multiasset.AssetInstance.Index
  | t.xcm.v1.multiasset.AssetInstance.Array4
  | t.xcm.v1.multiasset.AssetInstance.Array8
  | t.xcm.v1.multiasset.AssetInstance.Array16
  | t.xcm.v1.multiasset.AssetInstance.Array32
  | t.xcm.v1.multiasset.AssetInstance.Blob
export namespace AssetInstance {
  export interface Undefined {
    type: "Undefined"
  }
  export interface Index {
    type: "Index"
    value: t.Compact<t.u128>
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
  export function Undefined(): t.xcm.v1.multiasset.AssetInstance.Undefined {
    return { type: "Undefined" }
  }
  export function Index(
    value: t.xcm.v1.multiasset.AssetInstance.Index["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Index {
    return { type: "Index", value }
  }
  export function Array4(
    value: t.xcm.v1.multiasset.AssetInstance.Array4["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Array4 {
    return { type: "Array4", value }
  }
  export function Array8(
    value: t.xcm.v1.multiasset.AssetInstance.Array8["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Array8 {
    return { type: "Array8", value }
  }
  export function Array16(
    value: t.xcm.v1.multiasset.AssetInstance.Array16["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Array16 {
    return { type: "Array16", value }
  }
  export function Array32(
    value: t.xcm.v1.multiasset.AssetInstance.Array32["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Array32 {
    return { type: "Array32", value }
  }
  export function Blob(
    value: t.xcm.v1.multiasset.AssetInstance.Blob["value"],
  ): t.xcm.v1.multiasset.AssetInstance.Blob {
    return { type: "Blob", value }
  }
}

export type Fungibility =
  | t.xcm.v1.multiasset.Fungibility.Fungible
  | t.xcm.v1.multiasset.Fungibility.NonFungible
export namespace Fungibility {
  export interface Fungible {
    type: "Fungible"
    value: t.Compact<t.u128>
  }
  export interface NonFungible {
    type: "NonFungible"
    value: t.xcm.v1.multiasset.AssetInstance
  }
  export function Fungible(
    value: t.xcm.v1.multiasset.Fungibility.Fungible["value"],
  ): t.xcm.v1.multiasset.Fungibility.Fungible {
    return { type: "Fungible", value }
  }
  export function NonFungible(
    value: t.xcm.v1.multiasset.Fungibility.NonFungible["value"],
  ): t.xcm.v1.multiasset.Fungibility.NonFungible {
    return { type: "NonFungible", value }
  }
}

export interface MultiAsset {
  id: t.xcm.v1.multiasset.AssetId
  fun: t.xcm.v1.multiasset.Fungibility
}

export function MultiAsset(value: t.xcm.v1.multiasset.MultiAsset) {
  return value
}

export type MultiAssetFilter =
  | t.xcm.v1.multiasset.MultiAssetFilter.Definite
  | t.xcm.v1.multiasset.MultiAssetFilter.Wild
export namespace MultiAssetFilter {
  export interface Definite {
    type: "Definite"
    value: t.xcm.v1.multiasset.MultiAssets
  }
  export interface Wild {
    type: "Wild"
    value: t.xcm.v1.multiasset.WildMultiAsset
  }
  export function Definite(
    value: t.xcm.v1.multiasset.MultiAssetFilter.Definite["value"],
  ): t.xcm.v1.multiasset.MultiAssetFilter.Definite {
    return { type: "Definite", value }
  }
  export function Wild(
    value: t.xcm.v1.multiasset.MultiAssetFilter.Wild["value"],
  ): t.xcm.v1.multiasset.MultiAssetFilter.Wild {
    return { type: "Wild", value }
  }
}

export type MultiAssets = Array<t.xcm.v1.multiasset.MultiAsset>

export function MultiAssets(value: t.xcm.v1.multiasset.MultiAssets) {
  return value
}

export type WildFungibility = "Fungible" | "NonFungible"

export type WildMultiAsset =
  | t.xcm.v1.multiasset.WildMultiAsset.All
  | t.xcm.v1.multiasset.WildMultiAsset.AllOf
export namespace WildMultiAsset {
  export interface All {
    type: "All"
  }
  export interface AllOf {
    type: "AllOf"
    id: t.xcm.v1.multiasset.AssetId
    fun: t.xcm.v1.multiasset.WildFungibility
  }
  export function All(): t.xcm.v1.multiasset.WildMultiAsset.All {
    return { type: "All" }
  }
  export function AllOf(
    value: Omit<t.xcm.v1.multiasset.WildMultiAsset.AllOf, "type">,
  ): t.xcm.v1.multiasset.WildMultiAsset.AllOf {
    return { type: "AllOf", ...value }
  }
}
