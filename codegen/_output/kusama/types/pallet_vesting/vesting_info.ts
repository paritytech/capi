import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $vestingInfo: $.Codec<types.pallet_vesting.vesting_info.VestingInfo> = _codec.$253

export interface VestingInfo {
  locked: types.u128
  per_block: types.u128
  starting_block: types.u32
}

export function VestingInfo(value: types.pallet_vesting.vesting_info.VestingInfo) {
  return value
}
