import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as app from "./app.ts"

export type Equivocation =
  | types.sp_finality_grandpa.Equivocation.Prevote
  | types.sp_finality_grandpa.Equivocation.Precommit
export namespace Equivocation {
  export interface Prevote {
    type: "Prevote"
    value: types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote
  }
  export interface Precommit {
    type: "Precommit"
    value: types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit
  }
  export function Prevote(
    value: types.sp_finality_grandpa.Equivocation.Prevote["value"],
  ): types.sp_finality_grandpa.Equivocation.Prevote {
    return { type: "Prevote", value }
  }
  export function Precommit(
    value: types.sp_finality_grandpa.Equivocation.Precommit["value"],
  ): types.sp_finality_grandpa.Equivocation.Precommit {
    return { type: "Precommit", value }
  }
}

export interface EquivocationProof {
  set_id: types.u64
  equivocation: types.sp_finality_grandpa.Equivocation
}

export function EquivocationProof(value: types.sp_finality_grandpa.EquivocationProof) {
  return value
}
