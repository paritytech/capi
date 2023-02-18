import { alice, ValueRune } from "capi"
import { Indices } from "polkadot_dev/mod.ts"

const index = 254

const claim = Indices
  .claim({ index })
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .finalized()

await claim
  .into(ValueRune)
  .chain(() => Indices.Accounts.entry([index]).access(0))
  .log(`Index ${index} mapped to`)
  .run()
