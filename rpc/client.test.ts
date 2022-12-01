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
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    await t.step({
      name: "call",
      async fn() {
        const client = await T.polkadot.client
        const metadata = await client.call(client.providerRef.nextId(), "state_getMetadata", [])
        A.assertNotInstanceOf(metadata, Error)
        A.assert(!metadata.error)
        A.assertExists(metadata.result)
        await client.discard()
      },
    })

    await t.step({
      name: "subscribe",
      async fn() {
        const client = await T.polkadot.client
        const events: msg.NotificationMessage<"chain_subscribeAllHeads", known.Header>[] = []
        const stoppedSubscriptionId = await client.subscriptionFactory<[], known.Header>()(
          "chain_subscribeAllHeads",
          "chain_unsubscribeAllHeads",
          [],
          (ctx) => {
            let i = 0
            return (e) => {
              if (e instanceof Error || e.error) {
                return ctx.end(e)
              }
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
        events.forEach((e) => {
          A.assertNotInstanceOf(e, Error)
          A.assert(!e.error)
          A.assertExists(e.params.result.parentHash)
        })
        A.assert(typeof stoppedSubscriptionId === "string")
        await client.discard()
      },
    })

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
        const message = { id: 0 } as msg.EgressMessage
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
        const pending = client
          .subscriptionFactory()(null!, null!, null!, ({ end }) => (e) => end(e))
        const result = "$$$"
        emitEvent({ id: 0, result } as unknown as msg.OkMessage)
        emitEvent(new ProviderHandlerError(null!))
        emitEvent({ id: 1, result: true } as unknown as msg.OkMessage)
        A.assertInstanceOf(await pending, ProviderHandlerError)
        assertClientCleanup(client)
      },
    })

    await t.step({
      name: "subscribe error subscribing",
      async fn() {
        const { client, emitEvent } = createMockClient()
        const pending = client
          .subscriptionFactory()(null!, null!, null!, ({ end }) => (e) => end(e))
        const toEmit = {
          id: 0,
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
