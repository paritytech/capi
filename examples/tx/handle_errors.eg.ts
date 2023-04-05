/**
 * @title Decode and Unhandle Dispatch Errors
 * @stability unstable
 *
 * The `unhandleFailed` method of `ExtrinsicEventsRune` enables easy decoding
 * (and handling) of dispatch errors.
 */

import { assertInstanceOf } from "asserts"
import { alice, bob, ExtrinsicError } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances } from "contracts_dev/mod.js"

// The following should reject with an `ExtrinsicError`.
const extrinsicError = await Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: bob.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockEvents()
  .unhandleFailed()
  .rehandle(ExtrinsicError)
  .run()

// Ensure `extrinsicError` is in fact an instance of `ExtrinsicError`
console.log("The unhandled extrinsic error:", extrinsicError)
assertInstanceOf(extrinsicError, ExtrinsicError)
