import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkNonce: $.Codec<types.frame_system.extensions.check_nonce.CheckNonce> =
  codecs.$724
export type CheckNonce = types.Compact<types.u32>

export function CheckNonce(value: types.frame_system.extensions.check_nonce.CheckNonce) {
  return value
}
