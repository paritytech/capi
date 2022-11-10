import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const PreimageFor = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$453),
  value: _codec.$454,
}

/** The request status of a given hash. */
export const StatusFor = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$451,
}

/**
 * Register a preimage on-chain.
 *
 * If the preimage was previously requested, no fees or deposits are taken for providing
 * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
 */
export function note_preimage(
  value: Omit<t.types.pallet_preimage.pallet.Call.note_preimage, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Preimage", value: { ...value, type: "note_preimage" } }
}

/**
 * Request a preimage be uploaded to the chain without paying any fees or deposits.
 *
 * If the preimage requests has already been provided on-chain, we unreserve any deposit
 * a user may have paid, and take the control of the preimage out of their hands.
 */
export function request_preimage(
  value: Omit<t.types.pallet_preimage.pallet.Call.request_preimage, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Preimage", value: { ...value, type: "request_preimage" } }
}

/**
 * Clear an unrequested preimage from the runtime storage.
 *
 * If `len` is provided, then it will be a much cheaper operation.
 *
 * - `hash`: The hash of the preimage to be removed from the store.
 * - `len`: The length of the preimage of `hash`.
 */
export function unnote_preimage(
  value: Omit<t.types.pallet_preimage.pallet.Call.unnote_preimage, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Preimage", value: { ...value, type: "unnote_preimage" } }
}

/**
 * Clear a previously made request for a preimage.
 *
 * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
 */
export function unrequest_preimage(
  value: Omit<t.types.pallet_preimage.pallet.Call.unrequest_preimage, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Preimage", value: { ...value, type: "unrequest_preimage" } }
}
