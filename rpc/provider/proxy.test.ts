import * as A from "../../deps/std/testing/asserts.ts"
import * as T from "../../test_util/mod.ts"
import { proxyProvider } from "./proxy.ts"
import { setup } from "./test_util.ts"

Deno.test({
  name: "Proxy Provider",
  async fn(t) {
    await t.step({
      name: "send/listen",
      async fn() {
        const [ref, message] = await setup(proxyProvider, await T.polkadot.url, "system_health", [])
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
        const server = T.createWebSocketServer({
          onMessage: function() {
            this.close()
          },
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
        const server = T.createWebSocketServer()
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
