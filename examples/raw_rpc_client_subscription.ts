import { assertNotInstanceOf } from "#capi/deps/std/testing/asserts.ts"
import * as T from "#capi/test_util/mod.ts"

const client = await T.polkadot.client

const result = await client.subscriptionFactory()(
  "chain_subscribeAllHeads",
  "chain_unsubscribeNewHeads",
  [],
  (ctx) => {
    let i = 0
    return (e) => {
      assertNotInstanceOf(e, Error)
      console.log(e)
      if (i === 2) {
        return ctx.end(true)
      }
      i++
      return
    }
  },
)

// cspell:disable-next-line
console.log(`${result ? "S" : "Uns"}uccessfully unsubscribed`)

await client.discard()
