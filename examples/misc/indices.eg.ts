/**
 * @title Reserve an Index
 * @description Reserve an index using the indices pallet. Then retrieve
 * the user's account id using the index.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers, is } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa } = await createDevUsers()

/// Generate a random (but reasonably large) index.
const index = (crypto.getRandomValues(new Uint32Array([0]))[0]! | 4646) >>> 0

/// Claim the index.
const hash = await polkadotDev.Indices
  .claim({ index })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Claim index:")
  .finalized()
  .run()

/// Use the index to key into the indices accounts map.
const mapped = await polkadotDev.Indices.Accounts
  .value(index, hash)
  .unhandle(is(undefined))
  .access(0)
  .run()

/// The retrieved mapped account id should be Alexa's.
console.log(`Index ${index} Mapped to:`, mapped)
assertEquals(mapped, alexa.publicKey)
