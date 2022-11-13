import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $checkGenesis: $.Codec<types.frame_system.extensions.check_genesis.CheckGenesis> =
  _codec.$730

export function CheckGenesis() {
  return null
}

export type CheckGenesis = null
