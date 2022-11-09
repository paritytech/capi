import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $checkGenesis: $.Codec<t.frame_system.extensions.check_genesis.CheckGenesis> =
  _codec.$730

export function CheckGenesis() {
  return null
}

export type CheckGenesis = null
