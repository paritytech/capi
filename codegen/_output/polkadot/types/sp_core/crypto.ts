import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export type AccountId32 = Uint8Array

export function AccountId32(value: types.sp_core.crypto.AccountId32) {
  return value
}

export type KeyTypeId = Uint8Array

export function KeyTypeId(value: types.sp_core.crypto.KeyTypeId) {
  return value
}
