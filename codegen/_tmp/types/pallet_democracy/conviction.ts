import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $conviction: $.Codec<types.pallet_democracy.conviction.Conviction> = codecs.$235
export type Conviction =
  | "None"
  | "Locked1x"
  | "Locked2x"
  | "Locked3x"
  | "Locked4x"
  | "Locked5x"
  | "Locked6x"
