import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"
export * as sr25519 from "./sr25519/mod.ts"

export const $boundedOpaqueNetworkState: $.Codec<
  t.types.pallet_im_online.BoundedOpaqueNetworkState
> = _codec.$523

export const $heartbeat: $.Codec<t.types.pallet_im_online.Heartbeat> = _codec.$228

export interface BoundedOpaqueNetworkState {
  peer_id: Uint8Array
  external_addresses: Array<Uint8Array>
}

export function BoundedOpaqueNetworkState(
  value: t.types.pallet_im_online.BoundedOpaqueNetworkState,
) {
  return value
}

export interface Heartbeat {
  block_number: t.types.u32
  network_state: t.types.sp_core.offchain.OpaqueNetworkState
  session_index: t.types.u32
  authority_index: t.types.u32
  validators_len: t.types.u32
}

export function Heartbeat(value: t.types.pallet_im_online.Heartbeat) {
  return value
}
