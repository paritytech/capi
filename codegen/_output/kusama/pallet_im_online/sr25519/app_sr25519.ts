import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $public: $.Codec<t.pallet_im_online.sr25519.app_sr25519.Public> = _codec.$53

export const $signature: $.Codec<t.pallet_im_online.sr25519.app_sr25519.Signature> = _codec.$233

export type Public = t.sp_core.sr25519.Public

export function Public(value: t.pallet_im_online.sr25519.app_sr25519.Public) {
  return value
}

export type Signature = t.sp_core.sr25519.Signature

export function Signature(value: t.pallet_im_online.sr25519.app_sr25519.Signature) {
  return value
}
