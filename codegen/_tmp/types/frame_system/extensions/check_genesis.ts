import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $checkGenesis: $.Codec<types.frame_system.extensions.check_genesis.CheckGenesis> =
  codecs.$721
export type CheckGenesis = null

export function CheckGenesis() {
  return null
}
