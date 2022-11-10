import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $multiAsset: $.Codec<t.types.xcm.v0.multi_asset.MultiAsset> = _codec.$152

export type MultiAsset =
  | t.types.xcm.v0.multi_asset.MultiAsset.None
  | t.types.xcm.v0.multi_asset.MultiAsset.All
  | t.types.xcm.v0.multi_asset.MultiAsset.AllFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AllNonFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AbstractFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible
  | t.types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible
export namespace MultiAsset {
  export interface None {
    type: "None"
  }
  export interface All {
    type: "All"
  }
  export interface AllFungible {
    type: "AllFungible"
  }
  export interface AllNonFungible {
    type: "AllNonFungible"
  }
  export interface AllAbstractFungible {
    type: "AllAbstractFungible"
    id: Uint8Array
  }
  export interface AllAbstractNonFungible {
    type: "AllAbstractNonFungible"
    class: Uint8Array
  }
  export interface AllConcreteFungible {
    type: "AllConcreteFungible"
    id: t.types.xcm.v0.multi_location.MultiLocation
  }
  export interface AllConcreteNonFungible {
    type: "AllConcreteNonFungible"
    class: t.types.xcm.v0.multi_location.MultiLocation
  }
  export interface AbstractFungible {
    type: "AbstractFungible"
    id: Uint8Array
    amount: t.Compact<t.types.u128>
  }
  export interface AbstractNonFungible {
    type: "AbstractNonFungible"
    class: Uint8Array
    instance: t.types.xcm.v1.multiasset.AssetInstance
  }
  export interface ConcreteFungible {
    type: "ConcreteFungible"
    id: t.types.xcm.v0.multi_location.MultiLocation
    amount: t.Compact<t.types.u128>
  }
  export interface ConcreteNonFungible {
    type: "ConcreteNonFungible"
    class: t.types.xcm.v0.multi_location.MultiLocation
    instance: t.types.xcm.v1.multiasset.AssetInstance
  }
  export function None(): t.types.xcm.v0.multi_asset.MultiAsset.None {
    return { type: "None" }
  }
  export function All(): t.types.xcm.v0.multi_asset.MultiAsset.All {
    return { type: "All" }
  }
  export function AllFungible(): t.types.xcm.v0.multi_asset.MultiAsset.AllFungible {
    return { type: "AllFungible" }
  }
  export function AllNonFungible(): t.types.xcm.v0.multi_asset.MultiAsset.AllNonFungible {
    return { type: "AllNonFungible" }
  }
  export function AllAbstractFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible {
    return { type: "AllAbstractFungible", ...value }
  }
  export function AllAbstractNonFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible {
    return { type: "AllAbstractNonFungible", ...value }
  }
  export function AllConcreteFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible {
    return { type: "AllConcreteFungible", ...value }
  }
  export function AllConcreteNonFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible {
    return { type: "AllConcreteNonFungible", ...value }
  }
  export function AbstractFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AbstractFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AbstractFungible {
    return { type: "AbstractFungible", ...value }
  }
  export function AbstractNonFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible {
    return { type: "AbstractNonFungible", ...value }
  }
  export function ConcreteFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible {
    return { type: "ConcreteFungible", ...value }
  }
  export function ConcreteNonFungible(
    value: Omit<t.types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible, "type">,
  ): t.types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible {
    return { type: "ConcreteNonFungible", ...value }
  }
}
