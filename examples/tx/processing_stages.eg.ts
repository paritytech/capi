/**
 * @title Handling Different Extrinsic Statuses
 * @description Get promises corresponding to specific extrinsic statuses.
 * This is useful for tracking an extrinsic's submission lifecycle.
 */

import { westendDev } from "@capi/westend-dev"
import { createDevUsers, Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

/// Create two dev users. Alexa will send the funds to Billy.
const { alexa, billy } = await createDevUsers()

/// Create and submit the transaction.
const sent = westendDev.Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()

/// We can access and ingest lifecycle events as promises. For example,
/// here we get a promise, which resolves to the list of optional broadcasts
/// or false in the case that no broadcast status is emitted.
sent.broadcast().run().then((values) =>
  console.log("Broadcast:" + (values ? `"${values.join(`", "`)}"` : "true"))
)

/// For brevity, the following will use a `handle` helper, which wraps the
/// `run` and formatting of the result. Each of these corresponds to a specific status.
handle(sent.future(), "Future")
handle(sent.ready(), "Ready")
handle(sent.inBlock(), "In block")
handle(sent.retracted(), "Redacted")
handle(sent.finalityTimeout(), "Finality timeout")
handle(sent.finalized(), "Finalized")

/// hide-start
async function handle<U>(rune: Rune<HandleT, U>, label: string) {
  const value = await rune.run()
  if (value) {
    console.log(`${label}${typeof value === "undefined" ? "" : `: ${value}`}`)
  }
}
type HandleT = string | boolean | undefined
/// hide-end
