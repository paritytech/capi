import * as $ from "../deps/scale.ts"
import { DevNet, DevNetSpec, DevRelaySpec, devUserPublicKeys, NetSpec } from "../nets/mod.ts"
import { PermanentMemo } from "../util/mod.ts"
import { proxyWebSocket } from "../util/proxyWebSocket.ts"
import * as f from "./factories.ts"

const rDevnetsApi = /^\/devnets\/([\w-]+)$/

export function createDevnetsHandler(
  devnetTempDir: string,
  nets: Record<string, NetSpec>,
  signal: AbortSignal,
) {
  const networkMemo = new PermanentMemo<DevRelaySpec, Map<DevNetSpec, DevNet>>()
  let devUserIndex = 0
  return async (request: Request) => {
    const { pathname, searchParams } = new URL(request.url)
    if (request.method === "POST" && searchParams.has("users")) {
      const count = +searchParams.get("users")!
      if (!$.is($.u32, count)) return f.badRequest()
      const index = devUserIndex
      const newCount = index + count
      if (newCount < devUserPublicKeys.length) devUserIndex = newCount
      else throw new Error("Maximum dev user count reached")
      return new Response(`${index}`, { status: 200 })
    }
    const match = rDevnetsApi.exec(pathname)
    if (!match) return f.notFound()
    const name = match[1]!
    const net = nets[name]
    if (net instanceof DevNetSpec) {
      const network = await networkMemo.run(
        net.relay,
        () => net.relay.spawnNet(signal, devnetTempDir),
      )
      const chain = network.get(net)!
      if (request.headers.get("Upgrade") === "websocket") {
        const port = chain.ports.shift()!
        chain.ports.push(port)
        return proxyWebSocket(request, `ws://127.0.0.1:${port}`)
      }
      return new Response("Network launched")
    }
    return f.notFound()
  }
}
