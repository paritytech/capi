import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as app from "./app.ts"

export const $equivocation: $.Codec<t.types.sp_finality_grandpa.Equivocation> = _codec.$218

export const $equivocationProof: $.Codec<t.types.sp_finality_grandpa.EquivocationProof> =
  _codec.$217

export type Equivocation =
  | t.types.sp_finality_grandpa.Equivocation.Prevote
  | t.types.sp_finality_grandpa.Equivocation.Precommit
export namespace Equivocation {
  export interface Prevote {
    type: "Prevote"
    value: t.types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote
  }
  export interface Precommit {
    type: "Precommit"
    value: t.types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit
  }
  export function Prevote(
    value: t.types.sp_finality_grandpa.Equivocation.Prevote["value"],
  ): t.types.sp_finality_grandpa.Equivocation.Prevote {
    return { type: "Prevote", value }
  }
  export function Precommit(
    value: t.types.sp_finality_grandpa.Equivocation.Precommit["value"],
  ): t.types.sp_finality_grandpa.Equivocation.Precommit {
    return { type: "Precommit", value }
  }
}

export interface EquivocationProof {
  set_id: t.types.u64
  equivocation: t.types.sp_finality_grandpa.Equivocation
}

export function EquivocationProof(value: t.types.sp_finality_grandpa.EquivocationProof) {
  return value
}
