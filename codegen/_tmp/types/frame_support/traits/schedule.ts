import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $lookupError: $.Codec<types.frame_support.traits.schedule.LookupError> = codecs.$33
export type LookupError = "Unknown" | "BadFormat"

export const $maybeHashed: $.Codec<types.frame_support.traits.schedule.MaybeHashed> = codecs.$180
export type MaybeHashed =
  | types.frame_support.traits.schedule.MaybeHashed.Value
  | types.frame_support.traits.schedule.MaybeHashed.Hash
export namespace MaybeHashed {
  export interface Value {
    type: "Value"
    value: types.polkadot_runtime.Call
  }
  export interface Hash {
    type: "Hash"
    value: types.primitive_types.H256
  }
  export function Value(
    value: types.frame_support.traits.schedule.MaybeHashed.Value["value"],
  ): types.frame_support.traits.schedule.MaybeHashed.Value {
    return { type: "Value", value }
  }
  export function Hash(
    value: types.frame_support.traits.schedule.MaybeHashed.Hash["value"],
  ): types.frame_support.traits.schedule.MaybeHashed.Hash {
    return { type: "Hash", value }
  }
}
