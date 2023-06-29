/**
 * @title Balance Transfer
 * @description Transfer some funds from one user to another.
 */

import { WestendDev, westendDev } from "@capi/westend-dev"
import { assert } from "asserts"
import { createDevUsers, is } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

/// Create two dev users. Alexa will send the funds to Billy.
const { alexa, billy } = await createDevUsers()

type X = WestendDev

/// Reference Billy's free balance.
const billyFree = westendDev.System.Account
  .value(billy.publicKey)
  .unhandle(is(undefined))
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
  .finalized()
  .run()

/// Read the final free.
const finalFree = await billyFree.run()
console.log("Billy free final:", finalFree)

/// The final free should be greater than the initial.
assert(finalFree > initialFree)
