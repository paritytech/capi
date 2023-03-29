/**
 * @title Decode And Unhandle Dispatch Errors
 * @stability unstable
 *
 * The `unhandleFailed` method of `ExtrinsicEventsRune` enables easy decoding
 * (and handling) of dispatch errors.
 */

import { assertRejects } from "asserts"
import { alice, bob, ExtrinsicError } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances } from "westend_dev/mod.js"

// The following should reject with an `ExtrinsicError`.
assertRejects(() =>
  (Balances
    .transfer({
      value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
      dest: bob.address,
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus() as any)
    .finalizedEvents()
    .unhandleFailed()
    .run(), ExtrinsicError)
