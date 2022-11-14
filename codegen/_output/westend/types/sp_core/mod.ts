import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as crypto from "./crypto.ts"
export * as ecdsa from "./ecdsa.ts"
export * as ed25519 from "./ed25519.ts"
export * as offchain from "./offchain.ts"
export * as sr25519 from "./sr25519.ts"

export type OpaquePeerId = Uint8Array

export function OpaquePeerId(value: types.sp_core.OpaquePeerId) {
  return value
}

export type Void = never
