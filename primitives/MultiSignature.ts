import * as $ from "../deps/scale.ts"

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

export const $multiSignature: $.Codec<MultiSignature> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $.sizedUint8Array(64)]],
  1: ["Sr25519", ["value", $.sizedUint8Array(64)]],
  2: ["Ecdsa", ["value", $.sizedUint8Array(65)]],
})
