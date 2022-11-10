import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as PerDispatchClass from "./PerDispatchClass/mod.ts"

export const $dispatchClass: $.Codec<t.types.frame_support.dispatch.DispatchClass> = _codec.$22

export const $dispatchInfo: $.Codec<t.types.frame_support.dispatch.DispatchInfo> = _codec.$21

export const $pays: $.Codec<t.types.frame_support.dispatch.Pays> = _codec.$23

export const $rawOrigin: $.Codec<t.types.frame_support.dispatch.RawOrigin> = _codec.$257

export type DispatchClass = "Normal" | "Operational" | "Mandatory"

export interface DispatchInfo {
  weight: t.types.sp_weights.weight_v2.Weight
  class: t.types.frame_support.dispatch.DispatchClass
  pays_fee: t.types.frame_support.dispatch.Pays
}

export function DispatchInfo(value: t.types.frame_support.dispatch.DispatchInfo) {
  return value
}

export type Pays = "Yes" | "No"

export type RawOrigin =
  | t.types.frame_support.dispatch.RawOrigin.Root
  | t.types.frame_support.dispatch.RawOrigin.Signed
  | t.types.frame_support.dispatch.RawOrigin.None
export namespace RawOrigin {
  export interface Root {
    type: "Root"
  }
  export interface Signed {
    type: "Signed"
    value: t.types.sp_core.crypto.AccountId32
  }
  export interface None {
    type: "None"
  }
  export function Root(): t.types.frame_support.dispatch.RawOrigin.Root {
    return { type: "Root" }
  }
  export function Signed(
    value: t.types.frame_support.dispatch.RawOrigin.Signed["value"],
  ): t.types.frame_support.dispatch.RawOrigin.Signed {
    return { type: "Signed", value }
  }
  export function None(): t.types.frame_support.dispatch.RawOrigin.None {
    return { type: "None" }
  }
}
