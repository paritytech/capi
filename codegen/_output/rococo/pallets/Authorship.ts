import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Uncles */
export const Uncles = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Authorship",
  "Uncles",
  $.tuple(),
  _codec.$481,
)

/** Author of current block. */
export const Author = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Authorship",
  "Author",
  $.tuple(),
  _codec.$0,
)

/** Whether uncles were already set in this block. */
export const DidSetUncles = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Authorship",
  "DidSetUncles",
  $.tuple(),
  _codec.$43,
)

/** Provide a set of uncles. */
export function set_uncles(
  value: Omit<types.pallet_authorship.pallet.Call.set_uncles, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Authorship", value: { ...value, type: "set_uncles" } }
}
