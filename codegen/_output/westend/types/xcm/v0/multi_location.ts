import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $multiLocation: $.Codec<t.types.xcm.v0.multi_location.MultiLocation> = _codec.$153

export type MultiLocation =
  | t.types.xcm.v0.multi_location.MultiLocation.Null
  | t.types.xcm.v0.multi_location.MultiLocation.X1
  | t.types.xcm.v0.multi_location.MultiLocation.X2
  | t.types.xcm.v0.multi_location.MultiLocation.X3
  | t.types.xcm.v0.multi_location.MultiLocation.X4
  | t.types.xcm.v0.multi_location.MultiLocation.X5
  | t.types.xcm.v0.multi_location.MultiLocation.X6
  | t.types.xcm.v0.multi_location.MultiLocation.X7
  | t.types.xcm.v0.multi_location.MultiLocation.X8
export namespace MultiLocation {
  export interface Null {
    type: "Null"
  }
  export interface X1 {
    type: "X1"
    value: t.types.xcm.v0.junction.Junction
  }
  export interface X2 {
    type: "X2"
    value: [t.types.xcm.v0.junction.Junction, t.types.xcm.v0.junction.Junction]
  }
  export interface X3 {
    type: "X3"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export interface X4 {
    type: "X4"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export interface X5 {
    type: "X5"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export interface X6 {
    type: "X6"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export interface X7 {
    type: "X7"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export interface X8 {
    type: "X8"
    value: [
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
      t.types.xcm.v0.junction.Junction,
    ]
  }
  export function Null(): t.types.xcm.v0.multi_location.MultiLocation.Null {
    return { type: "Null" }
  }
  export function X1(
    value: t.types.xcm.v0.multi_location.MultiLocation.X1["value"],
  ): t.types.xcm.v0.multi_location.MultiLocation.X1 {
    return { type: "X1", value }
  }
  export function X2(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X2["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X2 {
    return { type: "X2", value }
  }
  export function X3(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X3["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X3 {
    return { type: "X3", value }
  }
  export function X4(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X4["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X4 {
    return { type: "X4", value }
  }
  export function X5(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X5["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X5 {
    return { type: "X5", value }
  }
  export function X6(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X6["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X6 {
    return { type: "X6", value }
  }
  export function X7(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X7["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X7 {
    return { type: "X7", value }
  }
  export function X8(
    ...value: t.types.xcm.v0.multi_location.MultiLocation.X8["value"]
  ): t.types.xcm.v0.multi_location.MultiLocation.X8 {
    return { type: "X8", value }
  }
}
