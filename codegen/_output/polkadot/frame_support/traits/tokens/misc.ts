import { $, BitSequence, ChainError, Era } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $balanceStatus: $.Codec<t.frame_support.traits.tokens.misc.BalanceStatus> = _codec.$37

export type BalanceStatus = "Free" | "Reserved"
