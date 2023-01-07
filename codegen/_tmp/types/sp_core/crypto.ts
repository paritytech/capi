import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $accountId32: $.Codec<types.sp_core.crypto.AccountId32> = codecs.$0
export type AccountId32 = Uint8Array

export function AccountId32(value: types.sp_core.crypto.AccountId32) {
  return value
}

export const $keyTypeId: $.Codec<types.sp_core.crypto.KeyTypeId> = codecs.$510
export type KeyTypeId = Uint8Array

export function KeyTypeId(value: types.sp_core.crypto.KeyTypeId) {
  return value
}
