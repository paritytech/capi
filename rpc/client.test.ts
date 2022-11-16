import * as A from "../deps/std/testing/asserts.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import {
  Client,
  known,
  msg,
  nextIdFactory,
  Provider,
  ProviderHandlerError,
  ProviderListener,
  ProviderSendError,
} from "./mod.ts"

Deno.test({
  name: "RPC Client",
  async fn(t) {
    const client = await T.polkadot.client

    await t.step({
      name: "call",
      sanitizeOps: false,
      sanitizeResources: false,
      async fn() {
        const metadata = await client.call(client.providerRef.nextId(), "state_getMetadata", [])
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
        >(client.providerRef.nextId(), "chain_subscribeAllHeads", "chain_unsubscribeNewHeads")(
          function(event) {
            const counter = this.state(U.Counter)
            A.assertNotInstanceOf(event, Error)
            A.assert(!event.error)
            A.assertExists(event.params.result.parentHash)
            subscriptionId = event.params.subscription
            events.push(event)
            if (counter.i === 2) {
              return this.end("HELLO")
            }
            counter.inc()
            return
          },
        )
        A.assertEquals(events.length, 3)
        A.assertEquals(stoppedSubscriptionId, subscriptionId!)
      },
    })

    await client.discard()

    await t.step({
      name: "call general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message = { id: client.providerRef.nextId() } as msg.EgressMessage
        const response = client.call(message)
        emitEvent(new ProviderSendError(null!, message))
        A.assertInstanceOf(await response, Error)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "call error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message = { id: client.providerRef.nextId() } as msg.EgressMessage
        const response = client.call(message)
        emitEvent(new ProviderSendError(null!, message))
        A.assertInstanceOf(await response, ProviderSendError)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message = { id: client.providerRef.nextId() } as msg.EgressMessage
        const response = client.subscribe(message, (event) => A.assertInstanceOf(event, Error))
        emitEvent(new ProviderSendError(null!, message))
        A.assertEquals(await response, undefined)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error after subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const response = client.subscribe({ id } as msg.EgressMessage, (_event) => {})
        const result = "$$$"
        emitEvent({ id, result } as msg.OkMessage)
        emitEvent(new ProviderHandlerError(null!))
        A.assertEquals(await response, result)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const response = client.subscribe({ id } as msg.EgressMessage, (_event) => {})
        emitEvent({
          id,
          error: {
            message: "some error",
          },
        } as msg.ErrorMessage)
        A.assertEquals(await response, undefined)
        assertClientCleanup(client)
      },
    })
  },
})

function assertClientCleanup(client: Client) {
  A.assertEquals(client.pendingCalls, {})
  A.assertEquals(client.pendingSubscriptions, {})
  A.assertEquals(client.activeSubscriptions, {})
  A.assertEquals(client.activeSubscriptionByMessageId, {})
}

function createMockClient() {
  let listener: ProviderListener<Error, Error>
  const nextId = nextIdFactory()
  const providerMockFactory: Provider = (_discoveryValue, clientListener) => {
    listener = clientListener
    return {
      nextId,
      send: () => {},
      release: () => Promise.resolve(undefined),
    }
  }
  return {
    client: new Client(providerMockFactory, null!),
    emitEvent: listener!,
  }
}
