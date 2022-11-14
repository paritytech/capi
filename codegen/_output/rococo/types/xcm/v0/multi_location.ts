import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type MultiLocation =
  | types.xcm.v0.multi_location.MultiLocation.Null
  | types.xcm.v0.multi_location.MultiLocation.X1
  | types.xcm.v0.multi_location.MultiLocation.X2
  | types.xcm.v0.multi_location.MultiLocation.X3
  | types.xcm.v0.multi_location.MultiLocation.X4
  | types.xcm.v0.multi_location.MultiLocation.X5
  | types.xcm.v0.multi_location.MultiLocation.X6
  | types.xcm.v0.multi_location.MultiLocation.X7
  | types.xcm.v0.multi_location.MultiLocation.X8
export namespace MultiLocation {
  export interface Null {
    type: "Null"
  }
  export interface X1 {
    type: "X1"
    value: types.xcm.v0.junction.Junction
  }
  export interface X2 {
    type: "X2"
    value: [types.xcm.v0.junction.Junction, types.xcm.v0.junction.Junction]
  }
  export interface X3 {
    type: "X3"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export interface X4 {
    type: "X4"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export interface X5 {
    type: "X5"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export interface X6 {
    type: "X6"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export interface X7 {
    type: "X7"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export interface X8 {
    type: "X8"
    value: [
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
      types.xcm.v0.junction.Junction,
    ]
  }
  export function Null(): types.xcm.v0.multi_location.MultiLocation.Null {
    return { type: "Null" }
  }
  export function X1(
    value: types.xcm.v0.multi_location.MultiLocation.X1["value"],
  ): types.xcm.v0.multi_location.MultiLocation.X1 {
    return { type: "X1", value }
  }
  export function X2(
    ...value: types.xcm.v0.multi_location.MultiLocation.X2["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X2 {
    return { type: "X2", value }
  }
  export function X3(
    ...value: types.xcm.v0.multi_location.MultiLocation.X3["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X3 {
    return { type: "X3", value }
  }
  export function X4(
    ...value: types.xcm.v0.multi_location.MultiLocation.X4["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X4 {
    return { type: "X4", value }
  }
  export function X5(
    ...value: types.xcm.v0.multi_location.MultiLocation.X5["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X5 {
    return { type: "X5", value }
  }
  export function X6(
    ...value: types.xcm.v0.multi_location.MultiLocation.X6["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X6 {
    return { type: "X6", value }
  }
  export function X7(
    ...value: types.xcm.v0.multi_location.MultiLocation.X7["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X7 {
    return { type: "X7", value }
  }
  export function X8(
    ...value: types.xcm.v0.multi_location.MultiLocation.X8["value"]
  ): types.xcm.v0.multi_location.MultiLocation.X8 {
    return { type: "X8", value }
  }
}
