/**
 * @title Balance Transfer
 * @stability nearing
 *
 * Transfer some funds from one user to another.
 */

import { assert } from "asserts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, createUsers, System } from "westend_dev/mod.js"

// Create two test users. Alexa will send the funds to Billy.
const { alexa, billy } = await createUsers()

// Reference Billy's free balance.
const billyFree = System.Account
  .value(billy.publicKey)
  .unhandle(undefined)
  .access("data", "free")

// Read the initial free.
const initialFree = await billyFree.run()
console.log("Billy free initial:", initialFree)

// Create and submit the transaction.
await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .finalized()
  .run()

// Read the final free.
const finalFree = await billyFree.run()
console.log("Billy free final:", finalFree)

// The final free should be greater than the initial.
assert(finalFree > initialFree)
