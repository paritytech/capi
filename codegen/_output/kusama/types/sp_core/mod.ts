import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as crypto from "./crypto.ts"
export * as ecdsa from "./ecdsa.ts"
export * as ed25519 from "./ed25519.ts"
export * as offchain from "./offchain.ts"
export * as sr25519 from "./sr25519.ts"

export const $opaquePeerId: $.Codec<types.sp_core.OpaquePeerId> = _codec.$230

export const $void: $.Codec<types.sp_core.Void> = _codec.$262

export type OpaquePeerId = Uint8Array

export function OpaquePeerId(value: types.sp_core.OpaquePeerId) {
  return value
}

export type Void = never
