import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkWeight: $.Codec<types.frame_system.extensions.check_weight.CheckWeight> =
  codecs.$725
export type CheckWeight = null

export function CheckWeight() {
  return null
}
