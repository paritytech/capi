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
        const events: msg.NotificationMessage<"chain_subscribeAllHeads", known.Header>[] = []
        const stoppedSubscriptionId = await client.subscriptionFactory<[], known.Header>()(
          "chain_subscribeAllHeads",
          "chain_unsubscribeNewHeads",
          [],
          (ctx) => {
            let i = 0
            return (e) => {
              A.assertNotInstanceOf(e, Error)
              A.assert(!e.error)
              A.assertExists(e.params.result.parentHash)
              events.push(e)
              if (i === 2) {
                return ctx.end(e.params.subscription)
              }
              i++
              return
            }
          },
        )
        A.assertEquals(events.length, 3)
        A.assert(typeof stoppedSubscriptionId === "string")
      },
    })

    await client.discard()

    await t.step({
      name: "call general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const pending = client.call(id, null!, null!)
        emitEvent(new ProviderSendError(null!, dummy(id)))
        A.assertInstanceOf(await pending, Error)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "call error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const pending = client.call(id, null!, null!)
        emitEvent(new ProviderSendError(null!, dummy(id)))
        A.assertInstanceOf(await pending, ProviderSendError)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe general error",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const message = { id: client.providerRef.nextId() } as msg.EgressMessage
        const pending = client
          .subscriptionFactory()(null!, null!, null!, ({ end }) => () => end())
        emitEvent(new ProviderSendError(null!, message))
        A.assertEquals(await pending, undefined)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error after subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const pending = client
          .subscriptionFactory()(null!, null!, null!, ({ end }) => (e) => end(e))
        const result = "$$$"
        emitEvent({ id, result } as unknown as msg.OkMessage)
        emitEvent(new ProviderHandlerError(null!))
        A.assertEquals(U.throwIfError(await pending).result, result)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const id = client.providerRef.nextId()
        const pending = client
          .subscriptionFactory()(null!, null!, null!, ({ end }) => (e) => end(e))
        const toEmit = {
          id,
          error: {
            message: "some error",
          },
        } as unknown as msg.ErrorMessage
        emitEvent(toEmit)
        A.assertEquals(U.throwIfError(await pending), toEmit)
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
  let listener: ProviderListener<any, any>
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

function dummy(id: number): msg.EgressMessage {
  return {
    id,
    method: null!,
    params: null!,
  } as any
}
