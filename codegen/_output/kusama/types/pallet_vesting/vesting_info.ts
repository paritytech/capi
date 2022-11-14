import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface VestingInfo {
  locked: types.u128
  per_block: types.u128
  starting_block: types.u32
}

export function VestingInfo(value: types.pallet_vesting.vesting_info.VestingInfo) {
  return value
}
