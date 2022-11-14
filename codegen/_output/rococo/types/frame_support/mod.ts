import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as dispatch from "./dispatch/mod.ts"
export * as traits from "./traits/mod.ts"

export type PalletId = Uint8Array

export function PalletId(value: types.frame_support.PalletId) {
  return value
}
