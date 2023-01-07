import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkMortality: $.Codec<
  types.frame_system.extensions.check_mortality.CheckMortality
> = codecs.$722
export type CheckMortality = C.Era

export function CheckMortality(
  value: types.frame_system.extensions.check_mortality.CheckMortality,
) {
  return value
}
