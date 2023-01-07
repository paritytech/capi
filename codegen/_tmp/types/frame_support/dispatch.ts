import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $rawOrigin: $.Codec<types.frame_support.dispatch.RawOrigin> = codecs.$256
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
