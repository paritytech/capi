import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $opaqueMultiaddr: $.Codec<t.types.sp_core.offchain.OpaqueMultiaddr> = _codec.$232

export const $opaqueNetworkState: $.Codec<t.types.sp_core.offchain.OpaqueNetworkState> = _codec.$229

export type OpaqueMultiaddr = Uint8Array

export function OpaqueMultiaddr(value: t.types.sp_core.offchain.OpaqueMultiaddr) {
  return value
}

export interface OpaqueNetworkState {
  peer_id: t.types.sp_core.OpaquePeerId
  external_addresses: Array<t.types.sp_core.offchain.OpaqueMultiaddr>
}

export function OpaqueNetworkState(value: t.types.sp_core.offchain.OpaqueNetworkState) {
  return value
}
