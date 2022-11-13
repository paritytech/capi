import * as $ from "../deps/scale.ts"
import { $null } from "./Codec.ts"

export const $multiSignature: $.Codec<MultiSignature> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $.sizedUint8Array(64)]],
  1: ["Sr25519", ["value", $.sizedUint8Array(64)]],
  2: ["Ecdsa", ["value", $.sizedUint8Array(65)]],
})

export const $multiAddress: $.Codec<MultiAddress> = $.taggedUnion("type", {
  0: ["Id", ["value", $.sizedUint8Array(32)]],
  1: ["Index", ["value", $null]],
  2: ["Raw", ["value", $.uint8Array]],
  3: ["Address32", ["value", $.sizedUint8Array(32)]],
  4: ["Address20", ["value", $.sizedUint8Array(20)]],
})

export type MultiSignature =
  | MultiSignature.Ed25519
  | MultiSignature.Sr25519
  | MultiSignature.Ecdsa
export namespace MultiSignature {
  export interface Ed25519 {
    type: "Ed25519"
    value: Uint8Array
  }
  export interface Sr25519 {
    type: "Sr25519"
    value: Uint8Array
  }
  export interface Ecdsa {
    type: "Ecdsa"
    value: Uint8Array
  }
  export function Ed25519(
    value: MultiSignature.Ed25519["value"],
  ): MultiSignature.Ed25519 {
    return { type: "Ed25519", value }
  }
  export function Sr25519(
    value: MultiSignature.Sr25519["value"],
  ): MultiSignature.Sr25519 {
    return { type: "Sr25519", value }
  }
  export function Ecdsa(
    value: MultiSignature.Ecdsa["value"],
  ): MultiSignature.Ecdsa {
    return { type: "Ecdsa", value }
  }
}

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
