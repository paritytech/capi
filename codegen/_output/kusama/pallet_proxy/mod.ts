import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $announcement: $.Codec<t.pallet_proxy.Announcement> = _codec.$585

export const $proxyDefinition: $.Codec<t.pallet_proxy.ProxyDefinition> = _codec.$581

export interface Announcement {
  real: t.sp_core.crypto.AccountId32
  call_hash: t.primitive_types.H256
  height: t.u32
}

export function Announcement(value: t.pallet_proxy.Announcement) {
  return value
}

export interface ProxyDefinition {
  delegate: t.sp_core.crypto.AccountId32
  proxy_type: t.polkadot_runtime.ProxyType
  delay: t.u32
}

export function ProxyDefinition(value: t.pallet_proxy.ProxyDefinition) {
  return value
}

export * as pallet from "./pallet.ts"
