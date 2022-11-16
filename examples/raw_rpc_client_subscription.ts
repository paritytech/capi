import { assertNotInstanceOf } from "#capi/deps/std/testing/asserts.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const client = await T.polkadot.client

const result = await client.subscribe(
  client.providerRef.nextId(),
  "chain_subscribeAllHeads",
  "chain_unsubscribeNewHeads",
)(function(e) {
  assertNotInstanceOf(e, Error)
  console.log(e)
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.end(true)
  }
  counter.inc()
  return
})

// cspell:disable-next-line
console.log(`${result ? "S" : "Uns"}uccessfully unsubscribed`)

await client.discard()
