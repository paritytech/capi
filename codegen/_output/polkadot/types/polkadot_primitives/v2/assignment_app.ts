import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $public: $.Codec<t.types.polkadot_primitives.v2.assignment_app.Public> = _codec.$214

export type Public = t.types.sp_core.sr25519.Public

export function Public(value: t.types.polkadot_primitives.v2.assignment_app.Public) {
  return value
}
