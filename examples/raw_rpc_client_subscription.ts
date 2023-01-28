import * as C from "capi/mod.ts"

import { rawClient } from "polkadot_dev/mod.ts"

const result = await rawClient.subscriptionFactory()(
  "chain_subscribeAllHeads",
  "chain_unsubscribeNewHeads",
  [],
  (ctx) => {
    let i = 0
    return (e) => {
      C.throwIfError(e)
      console.log(e)
      if (i === 2) return ctx.end(true)
      i++
      return
    }
  },
)

// cspell:disable-next-line
console.log(`${result ? "S" : "Uns"}uccessfully unsubscribed`)

await rawClient.discard()
