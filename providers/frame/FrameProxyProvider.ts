import { File } from "../../codegen/frame/mod.ts"
import { deferred } from "../../deps/std/async.ts"
import { WsConnection } from "../../rpc/mod.ts"
import { PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { FrameProvider } from "./FrameProvider.ts"

export abstract class FrameProxyProvider extends FrameProvider {
  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (
      !pathInfo.vRuntime && !pathInfo.filePath && request.headers.get("upgrade") === "websocket"
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
        vRuntime: "",
        filePath: "",
      }),
      this.env.wsHref,
    ).toString()
  }

  async connect(pathInfo: PathInfo, signal: AbortSignal) {
    return WsConnection.connect(await this.dynamicUrl(pathInfo), signal)
  }

  async chainFile(pathInfo: PathInfo) {
    const url = this.staticUrl(pathInfo)
    return new File(`
      import * as C from "./capi.ts"
      import type { Chain } from "./mod.ts"

      export const discoveryValue = "${url}"

      export const chain = C.connection((signal) => C.WsConnection.connect(discoveryValue, signal))
        .chain()["_asCodegen"]<Chain>()
    `)
  }
}
