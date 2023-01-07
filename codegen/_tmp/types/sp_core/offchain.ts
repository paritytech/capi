import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $opaqueMultiaddr: $.Codec<types.sp_core.offchain.OpaqueMultiaddr> = codecs.$232
export type OpaqueMultiaddr = Uint8Array

export function OpaqueMultiaddr(value: types.sp_core.offchain.OpaqueMultiaddr) {
  return value
}

export const $opaqueNetworkState: $.Codec<types.sp_core.offchain.OpaqueNetworkState> = codecs.$229
export interface OpaqueNetworkState {
  peerId: types.sp_core.OpaquePeerId
  externalAddresses: Array<types.sp_core.offchain.OpaqueMultiaddr>
}

export function OpaqueNetworkState(value: types.sp_core.offchain.OpaqueNetworkState) {
  return value
}
