import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $junctions: $.Codec<t.types.xcm.v1.multilocation.Junctions> = _codec.$123

export const $multiLocation: $.Codec<t.types.xcm.v1.multilocation.MultiLocation> = _codec.$122

export type Junctions =
  | t.types.xcm.v1.multilocation.Junctions.Here
  | t.types.xcm.v1.multilocation.Junctions.X1
  | t.types.xcm.v1.multilocation.Junctions.X2
  | t.types.xcm.v1.multilocation.Junctions.X3
  | t.types.xcm.v1.multilocation.Junctions.X4
  | t.types.xcm.v1.multilocation.Junctions.X5
  | t.types.xcm.v1.multilocation.Junctions.X6
  | t.types.xcm.v1.multilocation.Junctions.X7
  | t.types.xcm.v1.multilocation.Junctions.X8
export namespace Junctions {
  export interface Here {
    type: "Here"
  }
  export interface X1 {
    type: "X1"
    value: t.types.xcm.v1.junction.Junction
  }
  export interface X2 {
    type: "X2"
    value: [t.types.xcm.v1.junction.Junction, t.types.xcm.v1.junction.Junction]
  }
  export interface X3 {
    type: "X3"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export interface X4 {
    type: "X4"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export interface X5 {
    type: "X5"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export interface X6 {
    type: "X6"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export interface X7 {
    type: "X7"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export interface X8 {
    type: "X8"
    value: [
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
      t.types.xcm.v1.junction.Junction,
    ]
  }
  export function Here(): t.types.xcm.v1.multilocation.Junctions.Here {
    return { type: "Here" }
  }
  export function X1(
    value: t.types.xcm.v1.multilocation.Junctions.X1["value"],
  ): t.types.xcm.v1.multilocation.Junctions.X1 {
    return { type: "X1", value }
  }
  export function X2(
    ...value: t.types.xcm.v1.multilocation.Junctions.X2["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X2 {
    return { type: "X2", value }
  }
  export function X3(
    ...value: t.types.xcm.v1.multilocation.Junctions.X3["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X3 {
    return { type: "X3", value }
  }
  export function X4(
    ...value: t.types.xcm.v1.multilocation.Junctions.X4["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X4 {
    return { type: "X4", value }
  }
  export function X5(
    ...value: t.types.xcm.v1.multilocation.Junctions.X5["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X5 {
    return { type: "X5", value }
  }
  export function X6(
    ...value: t.types.xcm.v1.multilocation.Junctions.X6["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X6 {
    return { type: "X6", value }
  }
  export function X7(
    ...value: t.types.xcm.v1.multilocation.Junctions.X7["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X7 {
    return { type: "X7", value }
  }
  export function X8(
    ...value: t.types.xcm.v1.multilocation.Junctions.X8["value"]
  ): t.types.xcm.v1.multilocation.Junctions.X8 {
    return { type: "X8", value }
  }
}

export interface MultiLocation {
  parents: t.types.u8
  interior: t.types.xcm.v1.multilocation.Junctions
}

export function MultiLocation(value: t.types.xcm.v1.multilocation.MultiLocation) {
  return value
}
