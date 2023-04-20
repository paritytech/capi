/**
 * @title Offline Signing
 * @stability nearing
 * @description Create and sign an extrinsic, then serialize it into a hex for later use.
 * Finally, rehydrate the extrinsic and submit it.
 */

import { Balances, chain } from "@capi/westend-dev"
import { $, createDevUsers, SignedExtrinsicRune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa, billy } = await createDevUsers()

/// Create and sign the extrinsic. Extract the hex.
const hex = await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .hex()
  .run()

/// Save `hex` however you'd like (potentially sending to a relayer service,
/// writing to disk, etc.).
save(hex)

/// Hydrate the signed extrinsic, submit it and await finalization.
const hash = await SignedExtrinsicRune
  .fromHex(chain, hex)
  .sent()
  .dbgStatus("Tx status:")
  .finalized()
  .run()

/// Ensure the extrinsic has been finalized.
$.assert($.str, hash)

// hide-start
// The following noop is solely for explanation. Swap this out with your
// own signed-hex-representation-consuming code.
function save(_hex: string) {}
// hide-end
