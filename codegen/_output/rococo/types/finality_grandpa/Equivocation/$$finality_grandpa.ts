import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $precommit: $.Codec<
  t.types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit
> = _codec.$224

export const $prevote: $.Codec<t.types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote> =
  _codec.$219

export interface Precommit {
  round_number: t.types.u64
  identity: t.types.sp_finality_grandpa.app.Public
  first: [t.types.finality_grandpa.Precommit, t.types.sp_finality_grandpa.app.Signature]
  second: [t.types.finality_grandpa.Precommit, t.types.sp_finality_grandpa.app.Signature]
}

export function Precommit(
  value: t.types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit,
) {
  return value
}

export interface Prevote {
  round_number: t.types.u64
  identity: t.types.sp_finality_grandpa.app.Public
  first: [t.types.finality_grandpa.Prevote, t.types.sp_finality_grandpa.app.Signature]
  second: [t.types.finality_grandpa.Prevote, t.types.sp_finality_grandpa.app.Signature]
}

export function Prevote(value: t.types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote) {
  return value
}
