import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkTxVersion: $.Codec<
  types.frame_system.extensions.check_tx_version.CheckTxVersion
> = codecs.$720
export type CheckTxVersion = null

export function CheckTxVersion() {
  return null
}
