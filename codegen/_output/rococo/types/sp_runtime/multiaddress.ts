import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $multiAddress: $.Codec<t.types.sp_runtime.multiaddress.MultiAddress> = _codec.$197

export type MultiAddress =
  | t.types.sp_runtime.multiaddress.MultiAddress.Id
  | t.types.sp_runtime.multiaddress.MultiAddress.Index
  | t.types.sp_runtime.multiaddress.MultiAddress.Raw
  | t.types.sp_runtime.multiaddress.MultiAddress.Address32
  | t.types.sp_runtime.multiaddress.MultiAddress.Address20
export namespace MultiAddress {
  export interface Id {
    type: "Id"
    value: t.types.sp_core.crypto.AccountId32
  }
  export interface Index {
    type: "Index"
    value: t.Compact<null>
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
    value: t.types.sp_runtime.multiaddress.MultiAddress.Id["value"],
  ): t.types.sp_runtime.multiaddress.MultiAddress.Id {
    return { type: "Id", value }
  }
  export function Index(
    value: t.types.sp_runtime.multiaddress.MultiAddress.Index["value"],
  ): t.types.sp_runtime.multiaddress.MultiAddress.Index {
    return { type: "Index", value }
  }
  export function Raw(
    value: t.types.sp_runtime.multiaddress.MultiAddress.Raw["value"],
  ): t.types.sp_runtime.multiaddress.MultiAddress.Raw {
    return { type: "Raw", value }
  }
  export function Address32(
    value: t.types.sp_runtime.multiaddress.MultiAddress.Address32["value"],
  ): t.types.sp_runtime.multiaddress.MultiAddress.Address32 {
    return { type: "Address32", value }
  }
  export function Address20(
    value: t.types.sp_runtime.multiaddress.MultiAddress.Address20["value"],
  ): t.types.sp_runtime.multiaddress.MultiAddress.Address20 {
    return { type: "Address20", value }
  }
}
