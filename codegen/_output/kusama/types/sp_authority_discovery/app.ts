import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type Public = types.sp_core.sr25519.Public

export function Public(value: types.sp_authority_discovery.app.Public) {
  return value
}
