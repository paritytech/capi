import { alice, bob, ExtrinsicRune } from "capi"
import { Balances, client } from "polkadot_dev/mod.ts"

const result = await client
  .ifRuntimeGt(
    "0.9.36",
    Balances.transfer({
      value: 12345n,
      dest: bob.address,
    }),
    Balances.transfer({
      value: 56789n,
      dest: bob.address,
    }),
  )
  .into(ExtrinsicRune, client)
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .txEvents()
  .run()

console.log(result)
