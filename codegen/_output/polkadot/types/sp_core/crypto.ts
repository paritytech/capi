import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $accountId32: $.Codec<types.sp_core.crypto.AccountId32> = _codec.$0

export const $keyTypeId: $.Codec<types.sp_core.crypto.KeyTypeId> = _codec.$514

export type AccountId32 = Uint8Array

export function AccountId32(value: types.sp_core.crypto.AccountId32) {
  return value
}

export type KeyTypeId = Uint8Array

export function KeyTypeId(value: types.sp_core.crypto.KeyTypeId) {
  return value
}
