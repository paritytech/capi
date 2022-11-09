import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $checkTxVersion: $.Codec<t.frame_system.extensions.check_tx_version.CheckTxVersion> =
  _codec.$729

export function CheckTxVersion() {
  return null
}

export type CheckTxVersion = null
