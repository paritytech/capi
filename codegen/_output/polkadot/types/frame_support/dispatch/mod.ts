import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as PerDispatchClass from "./PerDispatchClass/mod.ts"

export const $dispatchClass: $.Codec<types.frame_support.dispatch.DispatchClass> = _codec.$22

export const $dispatchInfo: $.Codec<types.frame_support.dispatch.DispatchInfo> = _codec.$21

export const $pays: $.Codec<types.frame_support.dispatch.Pays> = _codec.$23

export const $rawOrigin: $.Codec<types.frame_support.dispatch.RawOrigin> = _codec.$257

export type DispatchClass = "Normal" | "Operational" | "Mandatory"

export interface DispatchInfo {
  weight: types.sp_weights.weight_v2.Weight
  class: types.frame_support.dispatch.DispatchClass
  pays_fee: types.frame_support.dispatch.Pays
}

export function DispatchInfo(value: types.frame_support.dispatch.DispatchInfo) {
  return value
}

export type Pays = "Yes" | "No"

export type RawOrigin =
  | types.frame_support.dispatch.RawOrigin.Root
  | types.frame_support.dispatch.RawOrigin.Signed
  | types.frame_support.dispatch.RawOrigin.None
export namespace RawOrigin {
  export interface Root {
    type: "Root"
  }
  export interface Signed {
    type: "Signed"
    value: types.sp_core.crypto.AccountId32
  }
  export interface None {
    type: "None"
  }
  export function Root(): types.frame_support.dispatch.RawOrigin.Root {
    return { type: "Root" }
  }
  export function Signed(
    value: types.frame_support.dispatch.RawOrigin.Signed["value"],
  ): types.frame_support.dispatch.RawOrigin.Signed {
    return { type: "Signed", value }
  }
  export function None(): types.frame_support.dispatch.RawOrigin.None {
    return { type: "None" }
  }
}
