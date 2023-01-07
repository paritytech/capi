import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $announcement: $.Codec<types.pallet_proxy.Announcement> = codecs.$580
export interface Announcement {
  real: types.sp_core.crypto.AccountId32
  callHash: types.primitive_types.H256
  height: types.u32
}

export function Announcement(value: types.pallet_proxy.Announcement) {
  return value
}

export const $proxyDefinition: $.Codec<types.pallet_proxy.ProxyDefinition> = codecs.$576
export interface ProxyDefinition {
  delegate: types.sp_core.crypto.AccountId32
  proxyType: types.polkadot_runtime.ProxyType
  delay: types.u32
}

export function ProxyDefinition(value: types.pallet_proxy.ProxyDefinition) {
  return value
}
