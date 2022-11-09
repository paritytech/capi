import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $conviction: $.Codec<t.pallet_democracy.conviction.Conviction> = _codec.$235

export type Conviction =
  | "None"
  | "Locked1x"
  | "Locked2x"
  | "Locked3x"
  | "Locked4x"
  | "Locked5x"
  | "Locked6x"
