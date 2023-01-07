import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $scheduledV3: $.Codec<types.pallet_scheduler.ScheduledV3> = codecs.$179
export interface ScheduledV3 {
  maybeId: Uint8Array | undefined
  priority: types.u8
  call: types.frame_support.traits.schedule.MaybeHashed
  maybePeriodic: [types.u32, types.u32] | undefined
  origin: types.polkadot_runtime.OriginCaller
}

export function ScheduledV3(value: types.pallet_scheduler.ScheduledV3) {
  return value
}
