import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Uncles */
export const Uncles = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Authorship",
  "Uncles",
  $.tuple(),
  codecs.$478,
)

/** Author of current block. */
export const Author = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Authorship",
  "Author",
  $.tuple(),
  codecs.$0,
)

/** Whether uncles were already set in this block. */
export const DidSetUncles = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Authorship",
  "DidSetUncles",
  $.tuple(),
  codecs.$43,
)

/** Provide a set of uncles. */
export function setUncles(value: Omit<types.pallet_authorship.pallet.Call.setUncles, "type">) {
  return { type: "Authorship", value: { ...value, type: "setUncles" } }
}

/**
 *  The number of blocks back we should accept uncles.
 *  This means that we will deal with uncle-parents that are
 *  `UncleGenerations + 1` before `now`.
 */
export const UncleGenerations: types.u32 = codecs.$4.decode(C.hex.decode("00000000" as C.Hex))
