import { assertNotInstanceOf } from "#capi/deps/std/testing/asserts.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const client = await T.polkadot.client

const subscriptionId = await client.subscribe({
  jsonrpc: "2.0",
  id: client.providerRef.nextId(),
  method: "chain_subscribeAllHeads",
  params: [],
}, function(e) {
  assertNotInstanceOf(e, Error)
  console.log(e)
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.stop()
  }
  counter.inc()
})

const { result } = U.throwIfError(
  await client.call({
    jsonrpc: "2.0",
    id: client.providerRef.nextId(),
    method: "chain_unsubscribeAllHeads",
    params: [subscriptionId],
  }),
)

console.log(
  // cspell:disable-next-line
  `${result ? "S" : "Uns"}uccessfully unsubscribed from subscription ${subscriptionId}`,
)

await client.discard()
