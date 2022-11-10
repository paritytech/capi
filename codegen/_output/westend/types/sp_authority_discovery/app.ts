import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $public: $.Codec<t.types.sp_authority_discovery.app.Public> = _codec.$215

export type Public = t.types.sp_core.sr25519.Public

export function Public(value: t.types.sp_authority_discovery.app.Public) {
  return value
}
