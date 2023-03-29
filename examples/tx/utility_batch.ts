/**
 * @title Utility Batch Tx
 * @stability nearing
 *
 * Sign and submit multiple calls within a single extrinsic.
 */

import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, createUsers, System, Utility } from "westend_dev/mod.js"

// Create four test users, one of whom will be the batch sender. The other
// three will be recipients of balance transfers described in the batch.
const [sender, ...recipients] = await createUsers(4)

// Reference the three recipient user free balances as a single Rune.
const balances = Rune.tuple(
  recipients.map(({ publicKey }) =>
    System.Account.value(publicKey).unhandle(undefined).access("data", "free")
  ),
)

// Retrieve the initial free.
console.log("Initial free:", await balances.run())

// Create and submit the batch call. Not how we must utilize `Rune.tuple` in
// order to convert the `Rune<RuntimeCall>[]` into a `Rune<RuntimeCall[]>`.
await Utility
  .batch({
    calls: Rune.tuple(recipients.map(({ address }) =>
      Balances.transfer({
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

// Retrieve the final free.
console.log("Final free:", await balances.run())
