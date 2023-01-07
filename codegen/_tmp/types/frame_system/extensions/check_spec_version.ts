import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkSpecVersion: $.Codec<
  types.frame_system.extensions.check_spec_version.CheckSpecVersion
> = codecs.$719
export type CheckSpecVersion = null

export function CheckSpecVersion() {
  return null
}
