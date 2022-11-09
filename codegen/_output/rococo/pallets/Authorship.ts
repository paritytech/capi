import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** Author of current block. */
export const Author = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$0,
}

/** Whether uncles were already set in this block. */
export const DidSetUncles = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$43,
}

/** Uncles */
export const Uncles = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$481,
}

/** Provide a set of uncles. */
export function set_uncles(
  value: Omit<t.pallet_authorship.pallet.Call.set_uncles, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Authorship", value: { ...value, type: "set_uncles" } }
}
