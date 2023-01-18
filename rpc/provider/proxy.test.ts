// import { client } from "http://localhost:8000/dev/westend@v0.9.36/client/raw.ts"
import * as A from "../../deps/std/testing/asserts.ts"
import { proxyProvider } from "./proxy.ts"
import { setup } from "./test_util.ts"

const client = null! as any

Deno.test({
  name: "Proxy Provider",
  async fn(t) {
    await t.step({
      name: "send/listen",
      async fn() {
        const [ref, message] = await setup(proxyProvider, client, "system_health", [])
        A.assertNotInstanceOf(message, Error)
        A.assertExists(message.result)
        A.assertNotInstanceOf(await ref.release(), Error)
      },
    })

    await t.step({
      name: "create WebSocket error",
      async fn() {
        const [ref, message] = await setup(
          proxyProvider,
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
          proxyProvider,
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
          proxyProvider,
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
