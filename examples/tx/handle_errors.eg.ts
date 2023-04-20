/**
 * @title Decode and Unhandle Dispatch Errors
 * @stability unstable
 * @description The `unhandleFailed` method of `ExtrinsicEventsRune` enables
 * easy decoding (and handling) of dispatch errors.
 */

import { Balances } from "@capi/contracts-dev"
import { assertInstanceOf } from "asserts"
import { createDevUsers, ExtrinsicError } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa, billy } = await createDevUsers()

/// The following should reject with an `ExtrinsicError`.
const extrinsicError = await Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockEvents()
  .unhandleFailed()
  .rehandle(ExtrinsicError)
  .run()

/// Ensure `extrinsicError` is in fact an instance of `ExtrinsicError`
console.log("The unhandled extrinsic error:", extrinsicError)
assertInstanceOf(extrinsicError, ExtrinsicError)
