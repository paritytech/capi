import { $, C } from "../../../../capi.ts"
import * as codecs from "../../../../codecs.ts"
import type * as types from "../../../mod.ts"

export const $balanceStatus: $.Codec<types.frame_support.traits.tokens.misc.BalanceStatus> =
  codecs.$37
export type BalanceStatus = "Free" | "Reserved"
