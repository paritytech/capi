import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $public: $.Codec<types.sp_authority_discovery.app.Public> = _codec.$215

export type Public = types.sp_core.sr25519.Public

export function Public(value: types.sp_authority_discovery.app.Public) {
  return value
}
