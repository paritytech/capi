import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $opaqueMultiaddr: $.Codec<types.sp_core.offchain.OpaqueMultiaddr> = _codec.$232

export const $opaqueNetworkState: $.Codec<types.sp_core.offchain.OpaqueNetworkState> = _codec.$229

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
