import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as dispatch from "./dispatch/mod.ts"
export * as traits from "./traits/mod.ts"

export const $palletId: $.Codec<types.frame_support.PalletId> = _codec.$560

export type PalletId = Uint8Array

export function PalletId(value: types.frame_support.PalletId) {
  return value
}
