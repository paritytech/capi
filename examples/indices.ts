import { alice, ValueRune } from "capi"
import { Indices } from "polkadot_dev/mod.ts"

const index = 254

const claim = Indices
  .claim({ index })
  .signed({ sender: alice })
  .sent()
  .dbgStatus()
  .finalized()

const result = await claim
  .into(ValueRune)
  .chain(() => Indices.Accounts.value(index).unhandle(undefined).access(0))
  .run()

console.log(`Index ${index} mapped to ${result}}`)
