import * as A from "../deps/std/testing/asserts.ts"
import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import * as known from "./known/mod.ts"
import * as msg from "./messages.ts"
import { Provider } from "./mod.ts"
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts"

const createMockClient = () => {
  let listener: C.rpc.ProviderListener<Error, Error>
  const providerMockFactory: Provider = (_discoveryValue, clientListener) => {
    listener = clientListener
    let i = 0
    return {
      nextId: () => (i++).toString(),
      send: () => {},
      release: async () => await undefined,
    }
  }
  const client = new C.rpc.Client<string, Error, Error, Error>(providerMockFactory, "")

  // @ts-ignore listener is assigned in the C.rpc.Client constructor
  return { client, emitEvent: listener }
}

Deno.test({
  name: "RPC Client",
  async fn(t) {
    const client = await T.polkadot.client

    await t.step({
      name: "call",
      sanitizeOps: false,
      sanitizeResources: false,
      async fn() {
        const metadata = await client.call({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "state_getMetadata",
          params: [],
        })
        A.assertNotInstanceOf(metadata, Error)
        A.assert(!metadata.error)
        A.assertExists(metadata.result)
      },
    })

    await t.step({
      name: "subscribe",
      sanitizeOps: false,
      sanitizeResources: false,
      async fn() {
        let subscriptionId: string
        const events: msg.NotificationMessage<"chain_subscribeAllHeads", known.Header>[] = []
        const stoppedSubscriptionId = await client.subscribe<
          "chain_subscribeAllHeads",
          known.Header
        >({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "chain_subscribeAllHeads",
          params: [],
        }, function(event) {
          const counter = this.state(U.Counter)
          A.assertNotInstanceOf(event, Error)
          A.assert(!event.error)
          A.assertExists(event.params.result.parentHash)
          subscriptionId = event.params.subscription
          events.push(event)
          if (counter.i === 2) {
            this.stop()
            return
          }
          counter.inc()
        })
        A.assertEquals(events.length, 3)
        A.assertEquals(stoppedSubscriptionId, subscriptionId!)
      },
    })

    await client.discard()

    await t.step({
      name: "call general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message: msg.EgressMessage = {
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "some_method",
          params: [],
        }
        const response = client.call(message)
        emitEvent(new ProviderSendError(new Error(), message))
        const result = await response
        A.assertInstanceOf(result, Error)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "call error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message: msg.EgressMessage = {
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "some_method",
          params: [],
        }
        const response = client.call(message)
        emitEvent(new ProviderSendError(new Error(), message))
        const result = await response
        A.assertInstanceOf(result, ProviderSendError)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message: msg.EgressMessage = {
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "some_method",
          params: [],
        }
        const response = client.subscribe(message, (event) => {
          A.assertInstanceOf(event, Error)
        })
        emitEvent(new ProviderSendError(new Error(), message))
        const result = await response
        A.assertEquals(result, undefined)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error after subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const response = client.subscribe(
          {
            jsonrpc: "2.0",
            id,
            method: "some_method",
            params: [],
          },
          (_event) => {},
        )
        emitEvent({
          id,
          result: "subId",
        } as msg.OkMessage)
        emitEvent(new ProviderHandlerError(new Error()))
        const result = await response
        A.assertEquals(result, "subId")
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const response = client.subscribe({
          jsonrpc: "2.0",
          id,
          method: "some_method",
          params: [],
        }, (_event) => {})
        emitEvent({
          id,
          error: {
            message: "some error",
          },
        } as msg.ErrorMessage)
        const result = await response
        A.assertEquals(result, undefined)
        assertClientCleanup(client)
      },
    })
  },
})

function assertClientCleanup(client: C.rpc.Client<string, Error, Error, Error>) {
  A.assertEquals(client.pendingCalls, {})
  A.assertEquals(client.pendingSubscriptions, {})
  A.assertEquals(client.activeSubscriptions, {})
  A.assertEquals(client.activeSubscriptionByMessageId, {})
}
