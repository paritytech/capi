/**
 * @title Ed25519 Signatures
 * @stability nearing
 *
 * Utilize an Ed25519 library for signing.
 */

import { assert } from "asserts"
import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import * as ed from "npm:@noble/ed25519"
import { sha512 } from "npm:@noble/hashes/sha512"
import { Balances, createUsers, System, types } from "westend_dev/mod.js"

const { alexa, billy } = await createUsers()

const billyFree = System.Account
  .value(billy.publicKey)
  .unhandle(undefined)
  .access("data", "free")

const billyFreeInitial = await billyFree.run()

// Bring your own Ed25519 implementation. In this case, we utilize
// [`noble-ed25519`](https://github.com/paulmillr/noble-ed25519), which
// requires us to specify a sync sha512 hasher implementation.
ed.etc.sha512Sync = (...msgs) => sha512(ed.etc.concatBytes(...msgs))

// Initialize a secret with the `crypto.getRandomValues` builtin.
const secret = crypto.getRandomValues(new Uint8Array(32))

// Get a Rune of the secret-corresponding multiaddress.
const address = types.sp_runtime.multiaddress.MultiAddress
  .Id(ed.getPublicKey(secret))

// Define a `sign` function for later use.
function sign(msg: Uint8Array) {
  return {
    type: "Ed25519" as const,
    value: ed.sign(msg, secret),
  }
}

// Transfer some funds to the derived address (existential deposit).
await Balances
  .transfer({
    value: 1_000_000_000_000n,
    dest: address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

// Execute a transfer from the derived user to Billy. We utilize our
// derived ed25519 `sign` function for this.
await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: Rune.rec({ address, sign }) }))
  .sent()
  .dbgStatus("Transfer:")
  .finalizedEvents()
  .run()

// Retrieve Billy's final free.
const billyFreeFinal = await billyFree.run()

// Ensure that the final is greater than the initial.
assert(billyFreeFinal > billyFreeInitial)
