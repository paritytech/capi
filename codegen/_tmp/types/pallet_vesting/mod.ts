import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"
export * as vesting_info from "./vesting_info.ts"

export const $releases: $.Codec<types.pallet_vesting.Releases> = codecs.$560
export type Releases = "V0" | "V1"
