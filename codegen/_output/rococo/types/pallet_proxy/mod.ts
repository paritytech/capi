import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

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
