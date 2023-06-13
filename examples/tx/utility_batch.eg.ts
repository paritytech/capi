/**
 * @title Batch Transaction
 * @stability nearing
 * @description Sign and submit multiple calls within a single extrinsic.
 */

import { westendDev } from "@capi/westend-dev"
import { assert } from "asserts"
import { createDevUsers, is, Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

/// Create four dev users, one of whom will be the batch sender. The other
/// three will be recipients of balance transfers described in the batch.
const [sender, ...recipients] = await createDevUsers(4)

/// Reference the three recipient user free balances as a single Rune.
const frees = Rune.tuple(
  recipients.map(({ publicKey }) =>
    westendDev.System.Account.value(publicKey).unhandle(is(undefined)).access("data", "free")
  ),
)

/// Retrieve the initial free balances of the recipients.
const initialFrees = await frees.run()
console.log("Initial frees:", initialFrees)

/// Create and submit the batch call. Not how we must utilize `Rune.tuple` in
/// order to convert the `Rune<RuntimeCall>[]` into a `Rune<RuntimeCall[]>`.
await westendDev.Utility
  .batch({
    calls: Rune.tuple(recipients.map(({ address }) =>
      westendDev.Balances.transfer({
        dest: address,
        value: 3_000_000_123_456_789n,
      })
    )),
  })
  .signed(signature({ sender }))
  .sent()
  .dbgStatus("Batch:")
  .finalized()
  .run()

/// Retrieve the final free balances of the recipients.
const finalFrees = await frees.run()
console.log("Final frees:", finalFrees)

/// Ensure that the final balances are greater than the initial ones.
recipients.forEach((_, i) => assert(finalFrees[i]! > initialFrees[i]!))
