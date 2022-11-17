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
  codecs.$481,
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
export function setUncles(
  value: Omit<types.pallet_authorship.pallet.Call.setUncles, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Authorship", value: { ...value, type: "setUncles" } }
}
