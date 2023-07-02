/**
 * @title Decode and Unhandle Dispatch Errors
 * @description The `unhandleFailed` method of `ExtrinsicEventsRune` enables
 * easy decoding (and handling) of dispatch errors.
 */

import { contractsDev } from "@capi/contracts-dev"
import { assert } from "asserts"
import { createDevUsers } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy } = await createDevUsers()

/// The following should reject with an `ExtrinsicError`.
const error = await contractsDev.Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .error()
  .run()

/// Ensure `extrinsicError` is in fact an instance of `ExtrinsicError`
console.log("The decoded extrinsic error:", error)
assert(error === "InsufficientBalance")
