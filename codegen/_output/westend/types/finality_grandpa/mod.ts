import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as Equivocation from "./Equivocation/mod.ts"

export const $precommit: $.Codec<t.types.finality_grandpa.Precommit> = _codec.$225

export const $prevote: $.Codec<t.types.finality_grandpa.Prevote> = _codec.$220

export interface Precommit {
  target_hash: t.types.primitive_types.H256
  target_number: t.types.u32
}

export function Precommit(value: t.types.finality_grandpa.Precommit) {
  return value
}

export interface Prevote {
  target_hash: t.types.primitive_types.H256
  target_number: t.types.u32
}

export function Prevote(value: t.types.finality_grandpa.Prevote) {
  return value
}
