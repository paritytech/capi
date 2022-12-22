import * as $ from "../deps/scale.ts"
import { $null } from "../scale_info/Codec.ts"

export const $multiAddress: $.Codec<MultiAddress> = $.taggedUnion("type", {
  0: ["Id", ["value", $.sizedUint8Array(32)]],
  1: ["Index", ["value", $null]],
  2: ["Raw", ["value", $.uint8Array]],
  3: ["Address32", ["value", $.sizedUint8Array(32)]],
  4: ["Address20", ["value", $.sizedUint8Array(20)]],
})

export type MultiAddress =
  | MultiAddress.Id
  | MultiAddress.Index
  | MultiAddress.Raw
  | MultiAddress.Address32
  | MultiAddress.Address20
export namespace MultiAddress {
  export interface Id {
    type: "Id"
    value: Uint8Array
  }
  export interface Index {
    type: "Index"
    value: null
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
    value: MultiAddress.Id["value"],
  ): MultiAddress.Id {
    return { type: "Id", value }
  }
  export function Index(
    value: MultiAddress.Index["value"],
  ): MultiAddress.Index {
    return { type: "Index", value }
  }
  export function Raw(
    value: MultiAddress.Raw["value"],
  ): MultiAddress.Raw {
    return { type: "Raw", value }
  }
  export function Address32(
    value: MultiAddress.Address32["value"],
  ): MultiAddress.Address32 {
    return { type: "Address32", value }
  }
  export function Address20(
    value: MultiAddress.Address20["value"],
  ): MultiAddress.Address20 {
    return { type: "Address20", value }
  }
}
