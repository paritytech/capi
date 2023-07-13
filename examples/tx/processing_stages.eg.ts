/**
 * @title Handling Different Extrinsic Statuses
 * @description Get promises corresponding to specific extrinsic statuses.
 * This is useful for tracking an extrinsic's submission lifecycle.
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

/// Attach callbacks to the pending status-specific promises.
sent.ready().run().then(() => console.log(`Ready`))
sent.inBlock().run().then((hash) => console.log(`In block ${hash}`))
sent.finalized().run().then((hash) => console.log(`Finalized ${hash}`))
