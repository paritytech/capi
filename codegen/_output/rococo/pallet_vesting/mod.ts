import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"
export * as vesting_info from "./vesting_info.ts"

export const $releases: $.Codec<t.pallet_vesting.Releases> = _codec.$565

export type Releases = "V0" | "V1"
