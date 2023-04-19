/**
 * @title Ed25519 Signatures
 * @stability nearing
 * @description Utilize an Ed25519 library for signing.
 */

import { Balances, MultiAddress, System } from "@capi/westend-dev"
import { assert } from "asserts"
import { createDevUsers, ExtrinsicSender } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import * as ed from "https://esm.sh/@noble/ed25519@1.7.3"

const { alexa, billy } = await createDevUsers()

const billyFree = System.Account
  .value(billy.publicKey)
  .unhandle(undefined)
  .access("data", "free")

const billyFreeInitial = await billyFree.run()
console.log("Billy free initial:", billyFreeInitial)

/// Initialize a secret with the `crypto.getRandomValues` builtin.
const secret = crypto.getRandomValues(new Uint8Array(32))

/// Get a Rune of the secret-corresponding multiaddress.
const address = MultiAddress.Id(await ed.getPublicKey(secret))

/// Define a `sign` function for later use.
async function sign(msg: Uint8Array) {
  return {
    type: "Ed25519" as const,
    value: await ed.sign(msg, secret),
  }
}

/// Transfer some funds to the derived address (existential deposit).
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

/// Execute a transfer from the derived user to Billy. We utilize our
/// derived ed25519 `sign` function for this.
await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: ExtrinsicSender({ address, sign }) }))
  .sent()
  .dbgStatus("Transfer:")
  .finalizedEvents()
  .run()

/// Retrieve Billy's final free.
const billyFreeFinal = await billyFree.run()
console.log("Billy free final:", billyFreeFinal)

/// Ensure that the final is greater than the initial.
assert(billyFreeFinal > billyFreeInitial)
