import * as path from "../deps/std/path.ts"
import { $ } from "../mod.ts"
import * as f from "../server/factories.ts"
import { PermanentMemo } from "../util/memo.ts"
import { CapiConfig } from "./CapiConfig.ts"
import { proxyWebSocket } from "./proxyWebSocket.ts"
import { Network, startNetwork } from "./startNetwork.ts"
import { testUserPublicKeys } from "./testUsers.ts"

const rDevnetsApi = /^\/devnets\/([\w-]+)(?:\/([\w-]+))?$/

export function createDevnetsHandler(tempDir: string, config: CapiConfig, signal: AbortSignal) {
  const networkMemo = new PermanentMemo<string, Network>()
  return async (request: Request) => {
    const { pathname, searchParams } = new URL(request.url)
    const match = rDevnetsApi.exec(pathname)
    if (!match) return f.notFound()
    const name = match[1]!
    const paraName = match[2]
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
      return proxyWebSocket(request, `ws://127.0.0.1:${port}`)
    }
    if (request.method === "POST" && searchParams.has("users")) {
      const count = +searchParams.get("users")!
      if (!$.is($.u32, count)) return f.badRequest()
      const index = chain.testUserIndex
      const newCount = index + count
      if (newCount < testUserPublicKeys.length) chain.testUserIndex = newCount
      else throw new Error("Maximum test user count reached")
      return new Response(`${index}`, { status: 200 })
    }
    return new Response("Network launched")
  }
}
