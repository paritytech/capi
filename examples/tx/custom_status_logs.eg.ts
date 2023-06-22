/**
 * @title Custom Status Logs
 * @description Submit a transaction with custom transaction status logs.
 */

import { westendDev } from "@capi/westend-dev"
import { createDevUsers } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

/// Create two dev users. Alexa will send the funds to Billy.
const { alexa, billy } = await createDevUsers()

// Create and submit the transaction.
const sent = westendDev.Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()

// Log the hash once it is in a block.
sent.inBlock().run().then((hash) => console.log("In block", hash))

// Log the events when it is finalized.
sent.finalizedEvents().run().then((hash) => console.log("Finalized events", hash))
