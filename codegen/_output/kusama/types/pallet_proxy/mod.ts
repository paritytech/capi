import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $announcement: $.Codec<t.types.pallet_proxy.Announcement> = _codec.$585

export const $proxyDefinition: $.Codec<t.types.pallet_proxy.ProxyDefinition> = _codec.$581

export interface Announcement {
  real: t.types.sp_core.crypto.AccountId32
  call_hash: t.types.primitive_types.H256
  height: t.types.u32
}

export function Announcement(value: t.types.pallet_proxy.Announcement) {
  return value
}

export interface ProxyDefinition {
  delegate: t.types.sp_core.crypto.AccountId32
  proxy_type: t.types.polkadot_runtime.ProxyType
  delay: t.types.u32
}

export function ProxyDefinition(value: t.types.pallet_proxy.ProxyDefinition) {
  return value
}
