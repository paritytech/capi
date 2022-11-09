import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as app from "./app.ts"

export const $equivocation: $.Codec<t.sp_finality_grandpa.Equivocation> = _codec.$218

export const $equivocationProof: $.Codec<t.sp_finality_grandpa.EquivocationProof> = _codec.$217

export type Equivocation =
  | t.sp_finality_grandpa.Equivocation.Prevote
  | t.sp_finality_grandpa.Equivocation.Precommit
export namespace Equivocation {
  export interface Prevote {
    type: "Prevote"
    value: t.finality_grandpa.Equivocation.$$finality_grandpa.Prevote
  }
  export interface Precommit {
    type: "Precommit"
    value: t.finality_grandpa.Equivocation.$$finality_grandpa.Precommit
  }
  export function Prevote(
    value: t.sp_finality_grandpa.Equivocation.Prevote["value"],
  ): t.sp_finality_grandpa.Equivocation.Prevote {
    return { type: "Prevote", value }
  }
  export function Precommit(
    value: t.sp_finality_grandpa.Equivocation.Precommit["value"],
  ): t.sp_finality_grandpa.Equivocation.Precommit {
    return { type: "Precommit", value }
  }
}

export interface EquivocationProof {
  set_id: t.u64
  equivocation: t.sp_finality_grandpa.Equivocation
}

export function EquivocationProof(value: t.sp_finality_grandpa.EquivocationProof) {
  return value
}
