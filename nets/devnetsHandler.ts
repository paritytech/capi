import { $ } from "../mod.ts"
import * as f from "../server/factories.ts"
import { PermanentMemo } from "../util/memo.ts"
import { devUserPublicKeys } from "./dev_users.ts"
import { Net } from "./Net.ts"
import { proxyWebSocket } from "./proxyWebSocket.ts"
import { SpawnDevNetResult } from "./spawnDevNet.ts"

const rDevnetsApi = /^\/devnets\/([\w-]+)$/

export function createDevnetsHandler(
  tempDir: string,
  nets: Record<string, Net>,
  signal: AbortSignal,
) {
  const networkMemo = new PermanentMemo<string, SpawnDevNetResult>()
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
    const spawn = nets[name]?.spawn
    if (!spawn) return f.notFound()
    const network = await networkMemo.run(name, () => spawn(signal, tempDir))
    if (request.headers.get("Upgrade") === "websocket") {
      const port = network.ports.shift()!
      network.ports.push(port)
      return proxyWebSocket(request, `ws://127.0.0.1:${port}`)
    }
    return new Response("Network launched")
  }
}
