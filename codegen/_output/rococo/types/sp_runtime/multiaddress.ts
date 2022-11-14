import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export type MultiAddress =
  | types.sp_runtime.multiaddress.MultiAddress.Id
  | types.sp_runtime.multiaddress.MultiAddress.Index
  | types.sp_runtime.multiaddress.MultiAddress.Raw
  | types.sp_runtime.multiaddress.MultiAddress.Address32
  | types.sp_runtime.multiaddress.MultiAddress.Address20
export namespace MultiAddress {
  export interface Id {
    type: "Id"
    value: types.sp_core.crypto.AccountId32
  }
  export interface Index {
    type: "Index"
    value: types.Compact<null>
  }
  export interface Raw {
    type: "Raw"
    value: Uint8Array
  }
  export interface Address32 {
    type: "Address32"
    value: Uint8Array
  }
  export interface Address20 {
    type: "Address20"
    value: Uint8Array
  }
  export function Id(
    value: types.sp_runtime.multiaddress.MultiAddress.Id["value"],
  ): types.sp_runtime.multiaddress.MultiAddress.Id {
    return { type: "Id", value }
  }
  export function Index(
    value: types.sp_runtime.multiaddress.MultiAddress.Index["value"],
  ): types.sp_runtime.multiaddress.MultiAddress.Index {
    return { type: "Index", value }
  }
  export function Raw(
    value: types.sp_runtime.multiaddress.MultiAddress.Raw["value"],
  ): types.sp_runtime.multiaddress.MultiAddress.Raw {
    return { type: "Raw", value }
  }
  export function Address32(
    value: types.sp_runtime.multiaddress.MultiAddress.Address32["value"],
  ): types.sp_runtime.multiaddress.MultiAddress.Address32 {
    return { type: "Address32", value }
  }
  export function Address20(
    value: types.sp_runtime.multiaddress.MultiAddress.Address20["value"],
  ): types.sp_runtime.multiaddress.MultiAddress.Address20 {
    return { type: "Address20", value }
  }
}
