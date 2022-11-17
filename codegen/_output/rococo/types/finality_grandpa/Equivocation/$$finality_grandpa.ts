import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export interface Precommit {
  roundNumber: types.u64
  identity: types.sp_finality_grandpa.app.Public
  first: [types.finality_grandpa.Precommit, types.sp_finality_grandpa.app.Signature]
  second: [types.finality_grandpa.Precommit, types.sp_finality_grandpa.app.Signature]
}

export function Precommit(value: types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit) {
  return value
}

export interface Prevote {
  roundNumber: types.u64
  identity: types.sp_finality_grandpa.app.Public
  first: [types.finality_grandpa.Prevote, types.sp_finality_grandpa.app.Signature]
  second: [types.finality_grandpa.Prevote, types.sp_finality_grandpa.app.Signature]
}

export function Prevote(value: types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote) {
  return value
}
