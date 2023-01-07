import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The request status of a given hash. */
export const StatusFor = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Preimage",
  "StatusFor",
  $.tuple(codecs.$10),
  codecs.$448,
)

/** The preimages stored by this pallet. */
export const PreimageFor = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Preimage",
  "PreimageFor",
  $.tuple(codecs.$10),
  codecs.$450,
)

/**
 * Register a preimage on-chain.
 *
 * If the preimage was previously requested, no fees or deposits are taken for providing
 * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
 */
export function notePreimage(value: Omit<types.pallet_preimage.pallet.Call.notePreimage, "type">) {
  return { type: "Preimage", value: { ...value, type: "notePreimage" } }
}

/** Clear an unrequested preimage from the runtime storage. */
export function unnotePreimage(
  value: Omit<types.pallet_preimage.pallet.Call.unnotePreimage, "type">,
) {
  return { type: "Preimage", value: { ...value, type: "unnotePreimage" } }
}

/**
 * Request a preimage be uploaded to the chain without paying any fees or deposits.
 *
 * If the preimage requests has already been provided on-chain, we unreserve any deposit
 * a user may have paid, and take the control of the preimage out of their hands.
 */
export function requestPreimage(
  value: Omit<types.pallet_preimage.pallet.Call.requestPreimage, "type">,
) {
  return { type: "Preimage", value: { ...value, type: "requestPreimage" } }
}

/**
 * Clear a previously made request for a preimage.
 *
 * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
 */
export function unrequestPreimage(
  value: Omit<types.pallet_preimage.pallet.Call.unrequestPreimage, "type">,
) {
  return { type: "Preimage", value: { ...value, type: "unrequestPreimage" } }
}
