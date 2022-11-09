import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $palletId: $.Codec<t.frame_support.PalletId> = _codec.$560

export type PalletId = Uint8Array

export function PalletId(value: t.frame_support.PalletId) {
  return value
}

export * as dispatch from "./dispatch/mod.ts"

export * as traits from "./traits/mod.ts"
