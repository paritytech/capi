import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $vestingInfo: $.Codec<t.types.pallet_vesting.vesting_info.VestingInfo> = _codec.$253

export interface VestingInfo {
  locked: t.types.u128
  per_block: t.types.u128
  starting_block: t.types.u32
}

export function VestingInfo(value: t.types.pallet_vesting.vesting_info.VestingInfo) {
  return value
}
