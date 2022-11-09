import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $checkSpecVersion: $.Codec<
  t.frame_system.extensions.check_spec_version.CheckSpecVersion
> = _codec.$728

export function CheckSpecVersion() {
  return null
}

export type CheckSpecVersion = null
