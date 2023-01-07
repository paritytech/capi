import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkNonZeroSender: $.Codec<
  types.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender
> = codecs.$718
export type CheckNonZeroSender = null

export function CheckNonZeroSender() {
  return null
}
