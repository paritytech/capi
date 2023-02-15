import { File } from "../../codegen/frame/mod.ts"
import { deferred } from "../../deps/std/async.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { FrameProvider } from "./FrameProvider.ts"

export abstract class FrameProxyProvider extends FrameProvider {
  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (
      pathInfo.vRuntime && pathInfo.vRuntime !== "latest" && !pathInfo.filePath
      && request.headers.get("upgrade") === "websocket"
    ) {
      return this.proxyWs(request, pathInfo)
    }
    return super.handle(request, pathInfo)
  }

  async proxyWs(request: Request, pathInfo: PathInfo) {
    const url = await this.dynamicUrl(pathInfo)
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

  abstract dynamicUrl(pathInfo: PathInfo): Promise<string>

  staticUrl(pathInfo: PathInfo) {
    return new URL(
      fromPathInfo({
        ...pathInfo,
        filePath: "",
      }),
      this.env.href.replace(/^http/, "ws"),
    ).toString()
  }

  async client(pathInfo: PathInfo) {
    const url = await this.dynamicUrl(pathInfo)
    const client = new Client(proxyProvider, url)
    this.env.signal.addEventListener("abort", client.discard)
    return client
  }

  async clientFile(pathInfo: PathInfo) {
    const url = this.staticUrl(pathInfo)
    return new File(`
      import * as C from "./capi.ts"
      import type { Chain } from "./mod.ts"

      export const discoveryValue = "${url}"

      export const client = C.rpcClient(C.rpc.proxyProvider, discoveryValue)["_asCodegen"]<Chain>()

      export const rawClient = new C.rpc.Client(C.rpc.proxyProvider, discoveryValue)
    `)
  }
}
