import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface VestingInfo {
  locked: types.u128
  perBlock: types.u128
  startingBlock: types.u32
}

export function VestingInfo(value: types.pallet_vesting.vesting_info.VestingInfo) {
  return value
}
