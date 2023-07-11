/**
 * @title Decode Dispatch Errors
 * @description The `inBlockErrors` and `finalizedErrors` methods of `ExtrinsicEventsRune`
 * enable easy extraction and decoding of dispatch errors.
 */

import { $palletBalancesError, contractsDev } from "@capi/contracts-dev"
import { $, createDevUsers } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy } = await createDevUsers()

/// The following should evaluate to a list with the decoded insufficient balance error event
const errors = await contractsDev.Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockErrors()
  .run()

/// Ensure `errors` is of the expected shape
console.log("The decoded extrinsic errors:", errors)
$.assert($.array($palletBalancesError), errors)
