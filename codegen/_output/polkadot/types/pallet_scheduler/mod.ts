import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $scheduled: $.Codec<t.types.pallet_scheduler.Scheduled> = _codec.$179

export interface Scheduled {
  maybe_id: Uint8Array | undefined
  priority: t.types.u8
  call: t.types.frame_support.traits.preimages.Bounded
  maybe_periodic: [t.types.u32, t.types.u32] | undefined
  origin: t.types.polkadot_runtime.OriginCaller
}

export function Scheduled(value: t.types.pallet_scheduler.Scheduled) {
  return value
}
