/**
 * @title Decode and Unhandle Dispatch Errors
 * @stability unstable
 * @description The `unhandleFailed` method of `ExtrinsicEventsRune` enables
 * easy decoding (and handling) of dispatch errors.
 */

import { contractsDev } from "@capi/contracts-dev"
import { assertInstanceOf } from "asserts"
import { createDevUsers, ExtrinsicError, is } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy } = await createDevUsers()

/// The following should reject with an `ExtrinsicError`.
const extrinsicError = await contractsDev.Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockEvents()
  .unhandleFailed()
  .rehandle(is(ExtrinsicError))
  .run()

/// Ensure `extrinsicError` is in fact an instance of `ExtrinsicError`
console.log("The unhandled extrinsic error:", extrinsicError)
assertInstanceOf(extrinsicError, ExtrinsicError)
