import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export type Public = types.sp_core.sr25519.Public

export function Public(value: types.pallet_im_online.sr25519.app_sr25519.Public) {
  return value
}

export type Signature = types.sp_core.sr25519.Signature

export function Signature(value: types.pallet_im_online.sr25519.app_sr25519.Signature) {
  return value
}
