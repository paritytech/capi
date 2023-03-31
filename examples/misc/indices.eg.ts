/**
 * @title Reserve an Index
 * @stability nearing
 *
 * Reserve an index using the indices pallet. Then retrieve the user's account id
 * using the index.
 */

import { assertEquals } from "asserts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { createUsers, Indices } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

const index = 254

// Claim the index.
const hash = await Indices
  .claim({ index })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Claim index:")
  .finalized()
  .run()

// Use the index to key into the indices accounts map.
const mapped = await Indices.Accounts
  .value(index, hash)
  .unhandle(undefined)
  .access(0)
  .run()

// The retrieved mapped account id should be Alexa's.
assertEquals(mapped, alexa.publicKey)
