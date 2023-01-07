import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as PerDispatchClass from "./PerDispatchClass/mod.ts"
export * as weight_v2 from "./weight_v2.ts"

export const $dispatchClass: $.Codec<types.frame_support.weights.DispatchClass> = codecs.$21
export type DispatchClass = "Normal" | "Operational" | "Mandatory"

export const $dispatchInfo: $.Codec<types.frame_support.weights.DispatchInfo> = codecs.$20
export interface DispatchInfo {
  weight: types.frame_support.weights.weight_v2.Weight
  class: types.frame_support.weights.DispatchClass
  paysFee: types.frame_support.weights.Pays
}

export function DispatchInfo(value: types.frame_support.weights.DispatchInfo) {
  return value
}

export const $pays: $.Codec<types.frame_support.weights.Pays> = codecs.$22
export type Pays = "Yes" | "No"

export const $runtimeDbWeight: $.Codec<types.frame_support.weights.RuntimeDbWeight> = codecs.$171
export interface RuntimeDbWeight {
  read: types.u64
  write: types.u64
}

export function RuntimeDbWeight(value: types.frame_support.weights.RuntimeDbWeight) {
  return value
}
