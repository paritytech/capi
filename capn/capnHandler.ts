import { deferred } from "../deps/std/async.ts"
import * as path from "../deps/std/path.ts"
import * as f from "../server/factories.ts"
import { PermanentMemo } from "../util/memo.ts"
import { CapiConfig } from "./CapiConfig.ts"
import { Network, startNetwork } from "./startNetwork.ts"
import { testUserPublicKeys } from "./testUsers.ts"

const rCapnApi = /^\/capn\/([\w-]+)(?:\/([\w-]+))?$/

export function createCapnHandler(tempDir: string, config: CapiConfig, signal: AbortSignal) {
  const networkMemo = new PermanentMemo<string, Network>()
  return async (request: Request) => {
    const { pathname, searchParams } = new URL(request.url)
    const match = rCapnApi.exec(pathname)
    if (!match) return f.notFound()
    const [, name, paraName] = match
    const networkConfig = config.chains?.[name!]
    if (networkConfig?.binary == null) return f.notFound()
    const network = await networkMemo.run(name!, async () => {
      return startNetwork(path.join(tempDir, name!), networkConfig, signal)
    })
    const chain = paraName ? network.paras[paraName] : network.relay
    if (!chain) return f.notFound()
    if (request.headers.get("Upgrade") === "websocket") {
      const port = chain.ports.shift()!
      chain.ports.push(port)
      return proxyWebSocket(request, `ws://localhost:${port}`)
    }
    if (request.method === "POST" && searchParams.has("users")) {
      const count = ~~searchParams.get("users")!
      // NaN comparisons are false
      if (!(count > 0)) return f.badRequest()
      const index = chain.testUserIndex
      const newCount = index + count
      if (newCount < testUserPublicKeys.length) chain.testUserIndex = newCount
      else throw new Error("Maximum test user count reached")
      return new Response(`${index}`, { status: 200 })
    }
    return new Response("Network launched")
  }
}

function proxyWebSocket(request: Request, url: string) {
  const server = new WebSocket(url)
  const { socket: client, response } = Deno.upgradeWebSocket(request)
  setup(client, server)
  setup(server, client)
  return response

  function setup(a: WebSocket, b: WebSocket) {
    const ready = deferred()
    b.addEventListener("open", () => {
      ready.resolve()
    })
    a.addEventListener("close", async () => {
      try {
        b.close()
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
