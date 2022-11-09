import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $vestingInfo: $.Codec<t.pallet_vesting.vesting_info.VestingInfo> = _codec.$253

export interface VestingInfo {
  locked: t.u128
  per_block: t.u128
  starting_block: t.u32
}

export function VestingInfo(value: t.pallet_vesting.vesting_info.VestingInfo) {
  return value
}
