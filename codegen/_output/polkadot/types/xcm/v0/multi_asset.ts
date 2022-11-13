import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $multiAsset: $.Codec<types.xcm.v0.multi_asset.MultiAsset> = _codec.$152

export type MultiAsset =
  | types.xcm.v0.multi_asset.MultiAsset.None
  | types.xcm.v0.multi_asset.MultiAsset.All
  | types.xcm.v0.multi_asset.MultiAsset.AllFungible
  | types.xcm.v0.multi_asset.MultiAsset.AllNonFungible
  | types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible
  | types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible
  | types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible
  | types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible
  | types.xcm.v0.multi_asset.MultiAsset.AbstractFungible
  | types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible
  | types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible
  | types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible
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
    id: types.xcm.v0.multi_location.MultiLocation
  }
  export interface AllConcreteNonFungible {
    type: "AllConcreteNonFungible"
    class: types.xcm.v0.multi_location.MultiLocation
  }
  export interface AbstractFungible {
    type: "AbstractFungible"
    id: Uint8Array
    amount: types.Compact<types.u128>
  }
  export interface AbstractNonFungible {
    type: "AbstractNonFungible"
    class: Uint8Array
    instance: types.xcm.v1.multiasset.AssetInstance
  }
  export interface ConcreteFungible {
    type: "ConcreteFungible"
    id: types.xcm.v0.multi_location.MultiLocation
    amount: types.Compact<types.u128>
  }
  export interface ConcreteNonFungible {
    type: "ConcreteNonFungible"
    class: types.xcm.v0.multi_location.MultiLocation
    instance: types.xcm.v1.multiasset.AssetInstance
  }
  export function None(): types.xcm.v0.multi_asset.MultiAsset.None {
    return { type: "None" }
  }
  export function All(): types.xcm.v0.multi_asset.MultiAsset.All {
    return { type: "All" }
  }
  export function AllFungible(): types.xcm.v0.multi_asset.MultiAsset.AllFungible {
    return { type: "AllFungible" }
  }
  export function AllNonFungible(): types.xcm.v0.multi_asset.MultiAsset.AllNonFungible {
    return { type: "AllNonFungible" }
  }
  export function AllAbstractFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AllAbstractFungible {
    return { type: "AllAbstractFungible", ...value }
  }
  export function AllAbstractNonFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AllAbstractNonFungible {
    return { type: "AllAbstractNonFungible", ...value }
  }
  export function AllConcreteFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AllConcreteFungible {
    return { type: "AllConcreteFungible", ...value }
  }
  export function AllConcreteNonFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AllConcreteNonFungible {
    return { type: "AllConcreteNonFungible", ...value }
  }
  export function AbstractFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AbstractFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AbstractFungible {
    return { type: "AbstractFungible", ...value }
  }
  export function AbstractNonFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.AbstractNonFungible {
    return { type: "AbstractNonFungible", ...value }
  }
  export function ConcreteFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.ConcreteFungible {
    return { type: "ConcreteFungible", ...value }
  }
  export function ConcreteNonFungible(
    value: Omit<types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible, "type">,
  ): types.xcm.v0.multi_asset.MultiAsset.ConcreteNonFungible {
    return { type: "ConcreteNonFungible", ...value }
  }
}
