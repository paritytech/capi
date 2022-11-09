import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $accountId32: $.Codec<t.sp_core.crypto.AccountId32> = _codec.$0

export const $keyTypeId: $.Codec<t.sp_core.crypto.KeyTypeId> = _codec.$514

export type AccountId32 = Uint8Array

export function AccountId32(value: t.sp_core.crypto.AccountId32) {
  return value
}

export type KeyTypeId = Uint8Array

export function KeyTypeId(value: t.sp_core.crypto.KeyTypeId) {
  return value
}
