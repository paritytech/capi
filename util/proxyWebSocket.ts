import { upgradeWebSocket } from "../deps/shims/upgradeWebSocket.ts"
import { deferred } from "../deps/std/async.ts"

export async function proxyWebSocket(request: Request, url: string) {
  const server = new WebSocket(url)
  const upgrade = upgradeWebSocket(request)
  const client = await upgrade.socket
  setup(client, server)
  setup(server, client)
  return upgrade.response

  function setup(a: WebSocket, b: WebSocket) {
    const ready = deferred()
    b.addEventListener("open", () => {
      ready.resolve()
    })
    a.addEventListener("close", async (e) => {
      try {
        b.close(e.code, e.reason)
      } catch {}
    })
    a.addEventListener("message", async (event) => {
      try {
        await ready
        b.send(event.data)
      } catch {
        a.close()
        b.close()
      }
    })
  }
}
