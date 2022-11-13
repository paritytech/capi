import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $releases: $.Codec<types.pallet_transaction_payment.Releases> = _codec.$480

export type Releases = "V1Ancient" | "V2"
