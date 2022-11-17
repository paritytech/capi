import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as Equivocation from "./Equivocation/mod.ts"

export interface Precommit {
  targetHash: types.primitive_types.H256
  targetNumber: types.u32
}

export function Precommit(value: types.finality_grandpa.Precommit) {
  return value
}

export interface Prevote {
  targetHash: types.primitive_types.H256
  targetNumber: types.u32
}

export function Prevote(value: types.finality_grandpa.Prevote) {
  return value
}
