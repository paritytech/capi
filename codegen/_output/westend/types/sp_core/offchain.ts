import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type OpaqueMultiaddr = Uint8Array

export function OpaqueMultiaddr(value: types.sp_core.offchain.OpaqueMultiaddr) {
  return value
}

export interface OpaqueNetworkState {
  peer_id: types.sp_core.OpaquePeerId
  external_addresses: Array<types.sp_core.offchain.OpaqueMultiaddr>
}

export function OpaqueNetworkState(value: types.sp_core.offchain.OpaqueNetworkState) {
  return value
}
