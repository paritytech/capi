import { deferred, delay } from "../../deps/std/async.ts"
import * as A from "../../deps/std/testing/asserts.ts"
import * as T from "../../test_util/mod.ts"
import { proxyProvider } from "./proxy.ts"

Deno.test({
  name: "Proxy Provider",
  async fn(t) {
    await t.step({
      name: "send/listen",
      async fn() {
        const stopped = deferred()
        const provider = proxyProvider(await T.polkadot.url, (message) => {
          A.assertNotInstanceOf(message, Error)
          A.assertExists(message.result)
          stopped.resolve()
        })
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "system_health",
          params: [],
        })
        await stopped
        const providerRelease = await provider.release()
        A.assertNotInstanceOf(providerRelease, Error)
      },
    })

    await t.step({
      name: "create WebSocket error",
      async fn() {
        const stopped = deferred()
        const provider = proxyProvider("invalid-endpoint-url", (message) => {
          A.assertInstanceOf(message, Error)
          stopped.resolve()
        })
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "system_health",
          params: [],
        })
        await stopped
        const providerRelease = await provider.release()
        A.assertNotInstanceOf(providerRelease, Error)
      },
    })

    await t.step({
      name: "close WebSocket while listening",
      ignore: true,
      async fn() {
        const server = createWebSocketServer()
        const stopped = deferred()
        const provider = proxyProvider(server.url, (message) => {
          A.assertInstanceOf(message, Error)
          stopped.resolve()
        })
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "system_health",
          params: [],
        })
        await delay(0)
        server.close()
        await stopped
        const providerRelease = await provider.release()
        A.assertNotInstanceOf(providerRelease, Error)
      },
    })

    await t.step({
      name: "send non-JSON message",
      async fn() {
        const server = createWebSocketServer()
        const stopped = deferred()
        const provider = proxyProvider(server.url, (message) => {
          A.assertInstanceOf(message, Error)
          stopped.resolve()
        })
        // @ts-ignore make JSON.stringify to throw
        provider.send(1n)
        await stopped
        const providerRelease = await provider.release()
        A.assertNotInstanceOf(providerRelease, Error)
        server.close()
      },
    })
  },
})

function createWebSocketServer(onMessage?: WebSocket["onmessage"]) {
  const onmessage: WebSocket["onmessage"] = onMessage
    ?? (() => {})
  const listener = Deno.listen({ port: 0 })
  const { port } = listener.addr as Deno.NetAddr
  const startServer = async () => {
    for await (const conn of listener) {
      for await (const e of Deno.serveHttp(conn)) {
        const { socket, response } = Deno.upgradeWebSocket(e.request)
        socket.onmessage = onmessage
        e.respondWith(response)
      }
    }
  }
  const close = () => listener.close()
  startServer()
  return {
    close,
    url: `ws://localhost:${port}`,
  }
}
