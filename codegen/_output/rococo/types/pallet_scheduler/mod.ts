import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $scheduled: $.Codec<types.pallet_scheduler.Scheduled> = _codec.$179

export interface Scheduled {
  maybe_id: Uint8Array | undefined
  priority: types.u8
  call: types.frame_support.traits.preimages.Bounded
  maybe_periodic: [types.u32, types.u32] | undefined
  origin: types.polkadot_runtime.OriginCaller
}

export function Scheduled(value: types.pallet_scheduler.Scheduled) {
  return value
}
