import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  Whether the paras inherent was included within this block.
 *
 *  The `Option<()>` is effectively a `bool`, but it never hits storage in the `None` variant
 *  due to the guarantees of FRAME's storage APIs.
 *
 *  If this is `None` at the end of the block, we panic and render the block invalid.
 */
export const Included = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$33,
}

/** Scraped on chain data for extracting resolved disputes as well as backing votes. */
export const OnChainVotes = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$647,
}

/** Enter the paras inherent. This will process bitfields and backed candidates. */
export function enter(
  value: Omit<t.types.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "ParaInherent", value: { ...value, type: "enter" } }
}
