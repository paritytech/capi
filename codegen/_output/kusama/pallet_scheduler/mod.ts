import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $scheduled: $.Codec<t.pallet_scheduler.Scheduled> = _codec.$179

export interface Scheduled {
  maybe_id: Uint8Array | undefined
  priority: t.u8
  call: t.frame_support.traits.preimages.Bounded
  maybe_periodic: [t.u32, t.u32] | undefined
  origin: t.polkadot_runtime.OriginCaller
}

export function Scheduled(value: t.pallet_scheduler.Scheduled) {
  return value
}
