import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"
export * as sr25519 from "./sr25519/mod.ts"

export const $boundedOpaqueNetworkState: $.Codec<t.pallet_im_online.BoundedOpaqueNetworkState> =
  _codec.$523

export const $heartbeat: $.Codec<t.pallet_im_online.Heartbeat> = _codec.$228

export interface BoundedOpaqueNetworkState {
  peer_id: Uint8Array
  external_addresses: Array<Uint8Array>
}

export function BoundedOpaqueNetworkState(value: t.pallet_im_online.BoundedOpaqueNetworkState) {
  return value
}

export interface Heartbeat {
  block_number: t.u32
  network_state: t.sp_core.offchain.OpaqueNetworkState
  session_index: t.u32
  authority_index: t.u32
  validators_len: t.u32
}

export function Heartbeat(value: t.pallet_im_online.Heartbeat) {
  return value
}
