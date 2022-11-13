import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $checkNonZeroSender: $.Codec<
  types.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender
> = _codec.$727

export function CheckNonZeroSender() {
  return null
}

export type CheckNonZeroSender = null
