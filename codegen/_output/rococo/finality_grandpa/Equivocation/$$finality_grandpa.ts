import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $precommit: $.Codec<t.finality_grandpa.Equivocation.$$finality_grandpa.Precommit> =
  _codec.$224

export const $prevote: $.Codec<t.finality_grandpa.Equivocation.$$finality_grandpa.Prevote> =
  _codec.$219

export interface Precommit {
  round_number: t.u64
  identity: t.sp_finality_grandpa.app.Public
  first: [t.finality_grandpa.Precommit, t.sp_finality_grandpa.app.Signature]
  second: [t.finality_grandpa.Precommit, t.sp_finality_grandpa.app.Signature]
}

export function Precommit(value: t.finality_grandpa.Equivocation.$$finality_grandpa.Precommit) {
  return value
}

export interface Prevote {
  round_number: t.u64
  identity: t.sp_finality_grandpa.app.Public
  first: [t.finality_grandpa.Prevote, t.sp_finality_grandpa.app.Signature]
  second: [t.finality_grandpa.Prevote, t.sp_finality_grandpa.app.Signature]
}

export function Prevote(value: t.finality_grandpa.Equivocation.$$finality_grandpa.Prevote) {
  return value
}
