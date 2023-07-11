/**
 * @title Get The Events And Errors Of An Extrinsic
 * @description Use both `finalizedEvents` and `finalizedErrors` to get the
 * events and errors of an extrinsic.
 */

import { $palletBalancesError, $runtimeEvent, polkadotDev } from "@capi/polkadot-dev"
import { $, createDevUsers, Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy } = await createDevUsers()

/// Get a reference to our sent extrinsic
const sent = polkadotDev.Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")

/// Run the extrinsic and extract the related events and errors
const [events, errors] = await Rune
  .tuple([
    sent.finalizedEvents(),
    sent.finalizedErrors(),
  ])
  .run()

/// Ensure the events are of the expected shape
console.log("The decoded runtime events:", events)
$.assert($.array($runtimeEvent), events.map(({ event }) => event))

/// Ensure the errors are of the expected shape
console.log("The decoded extrinsic errors:", errors)
$.assert($.array($palletBalancesError), errors)
