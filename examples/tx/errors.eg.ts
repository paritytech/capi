/**
 * @title Get the Errors of an Errors
 * @description The `inBlockErrors` and `finalizedErrors` methods of
 * `ExtrinsicEventsRune` simplify the decoding of error event data.
 */

import { $palletBalancesError, polkadotDev } from "@capi/polkadot-dev"
import { $, createDevUsers } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy } = await createDevUsers()

/// The following should evaluate to a list with the decoded insufficient balance error event
const errors = await polkadotDev.Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .finalizedErrors()
  .run()

/// Ensure `errors` is of the expected shape
console.log("The decoded extrinsic errors:", errors)
$.assert($.array($palletBalancesError), errors)
