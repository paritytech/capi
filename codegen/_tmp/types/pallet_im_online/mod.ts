import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"
export * as sr25519 from "./sr25519/mod.ts"

export const $boundedOpaqueNetworkState: $.Codec<types.pallet_im_online.BoundedOpaqueNetworkState> =
  codecs.$519
export interface BoundedOpaqueNetworkState {
  peerId: Uint8Array
  externalAddresses: Array<Uint8Array>
}

export function BoundedOpaqueNetworkState(value: types.pallet_im_online.BoundedOpaqueNetworkState) {
  return value
}

export const $heartbeat: $.Codec<types.pallet_im_online.Heartbeat> = codecs.$228
export interface Heartbeat {
  blockNumber: types.u32
  networkState: types.sp_core.offchain.OpaqueNetworkState
  sessionIndex: types.u32
  authorityIndex: types.u32
  validatorsLen: types.u32
}

export function Heartbeat(value: types.pallet_im_online.Heartbeat) {
  return value
}
