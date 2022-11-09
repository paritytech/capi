import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $public: $.Codec<t.polkadot_primitives.v2.assignment_app.Public> = _codec.$214

export type Public = t.sp_core.sr25519.Public

export function Public(value: t.polkadot_primitives.v2.assignment_app.Public) {
  return value
}
