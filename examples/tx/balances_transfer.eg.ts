/**
 * @title Balance Transfer
 * @stability nearing
 * @description Transfer some funds from one user to another.
 */

import { westendDev } from "@capi/westend-dev"
import { assert } from "asserts"
import { createDevUsers } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

/// Create two dev users. Alexa will send the funds to Billy.
const { alexa, billy } = await createDevUsers()

/// Reference Billy's free balance.
const billyFree = westendDev.System.Account
  .value(billy.publicKey)
  .unhandle(undefined)
  .access("data", "free")

/// Read the initial free.
const initialFree = await billyFree.run()
console.log("Billy free initial:", initialFree)

// Create and submit the transaction.
await westendDev.Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .finalizedEvents()
  .unhandleFailed()
  .run()

/// Read the final free.
const finalFree = await billyFree.run()
console.log("Billy free final:", finalFree)

/// The final free should be greater than the initial.
assert(finalFree > initialFree)
