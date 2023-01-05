import * as A from "../../deps/std/testing/asserts.ts"
import * as T from "../../test_util/mod.ts"
import { proxyProviderFactory } from "./proxy.ts"
import { setup } from "./test_util.ts"

Deno.test({
  name: "Proxy Provider",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    await t.step({
      name: "send/listen",
      // TODO: await T.polkadot initializes a 2nd proxyProvider
      sanitizeResources: false,
      sanitizeOps: false,
      async fn() {
        const [ref, message] = await setup(
          proxyProviderFactory(),
          await T.polkadot.url,
          "system_health",
          [],
        )
        A.assertNotInstanceOf(message, Error)
        A.assertExists(message.result)
        A.assertNotInstanceOf(await ref.release(), Error)
      },
    })

    await t.step({
      name: "create WebSocket error",
      async fn() {
        const [ref, message] = await setup(
          proxyProviderFactory({ retryOptions: { maxAttempts: 1 } }),
          "invalid-endpoint-url",
          "system_health",
          [],
        )
        A.assertInstanceOf(message, Error)
        A.assertNotInstanceOf(await ref.release(), Error)
      },
    })

    await t.step({
      name: "close WebSocket while listening",
      async fn() {
        const server = createWebSocketServer(function() {
          this.close()
        })
        const [ref, message] = await setup(
          proxyProviderFactory(),
          server.url,
          "system_health",
          [],
        )
        A.assertInstanceOf(message, Error)
        A.assertNotInstanceOf(await ref.release(), Error)
        server.close()
      },
    })

    await t.step({
      name: "send non-JSON message",
      async fn() {
        const server = createWebSocketServer()
        const [ref, message] = await setup(
          proxyProviderFactory(),
          server.url,
          "system_health",
          // make JSON.stringify to throw
          [1n],
        )
        A.assertInstanceOf(message, Error)
        A.assertNotInstanceOf(await ref.release(), Error)
        server.close()
      },
    })
  },
})

function createWebSocketServer(onMessage?: WebSocket["onmessage"]) {
  const onmessage = onMessage ?? (() => {})
  const listener = Deno.listen({ port: 0 })
  ;(async () => {
    for await (const conn of listener) {
      for await (const e of Deno.serveHttp(conn)) {
        const { socket, response } = Deno.upgradeWebSocket(e.request)
        socket.onmessage = onmessage
        e.respondWith(response)
      }
    }
  })()
  return {
    close: () => listener.close(),
    url: `ws://localhost:${(listener.addr as Deno.NetAddr).port}`,
  }
}
