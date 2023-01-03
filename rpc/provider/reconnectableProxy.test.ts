import { deadline, deferred, delay } from "../../deps/std/async.ts"
import { assertEquals, assertInstanceOf } from "../../deps/std/testing/asserts.ts"
import { getOpenPort } from "../../test_util/common.ts"
import * as T from "../../test_util/mod.ts"
import { reconnectableProxyProviderFactory } from "./reconnectableProxy.ts"

Deno.test({
  name: "Reconnectable Proxy Provider",
  async fn() {
    const port = getOpenPort()
    const { waiter, listener } = takeListenerEvents(3)
    const provider = reconnectableProxyProviderFactory(1)(`ws://127.0.0.1:${port}`, listener)
    const message = { id: 0, jsonrpc: "2.0" as const, method: "method", params: [] }
    // send without an active connection
    provider.send(message)
    const server1 = await T.createWebSocketServer({
      port,
      onMessage: function(v: MessageEvent<string>) {
        this.send(v.data)
      },
    })
    await delay(0)
    // send with an active connection
    provider.send(message)
    const events = await waiter
    assertInstanceOf(events[0], Error)
    assertInstanceOf(events[1], Error)
    assertEquals(events[2], message)
    server1.close()
    provider.release()
  },
})

function takeListenerEvents<T>(count: number, deadlineDelay = 1000) {
  const waiter = deferred<T[]>()
  const events: T[] = []
  const listener = (e: T) => {
    events.push(e)
    if (events.length === count) {
      waiter.resolve(events)
    }
  }
  return { waiter: deadline(waiter, deadlineDelay), listener }
}
