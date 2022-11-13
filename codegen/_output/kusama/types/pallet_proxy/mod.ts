import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $announcement: $.Codec<types.pallet_proxy.Announcement> = _codec.$585

export const $proxyDefinition: $.Codec<types.pallet_proxy.ProxyDefinition> = _codec.$581

export interface Announcement {
  real: types.sp_core.crypto.AccountId32
  call_hash: types.primitive_types.H256
  height: types.u32
}

export function Announcement(value: types.pallet_proxy.Announcement) {
  return value
}

export interface ProxyDefinition {
  delegate: types.sp_core.crypto.AccountId32
  proxy_type: types.polkadot_runtime.ProxyType
  delay: types.u32
}

export function ProxyDefinition(value: types.pallet_proxy.ProxyDefinition) {
  return value
}
