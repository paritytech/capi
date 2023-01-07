import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as dispatch from "./dispatch.ts"
export * as traits from "./traits/mod.ts"
export * as weights from "./weights/mod.ts"

export const $palletId: $.Codec<types.frame_support.PalletId> = codecs.$555
export type PalletId = Uint8Array

export function PalletId(value: types.frame_support.PalletId) {
  return value
}
