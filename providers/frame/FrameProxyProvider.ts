import { deferred } from "../../deps/std/async.ts"
import { WsConnection } from "../../rpc/mod.ts"
import { PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { FrameProvider } from "./FrameProvider.ts"

export abstract class FrameProxyProvider extends FrameProvider {
  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (
      !pathInfo.filePath && request.headers.get("upgrade") === "websocket"
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
      this.env.upgradedHref,
    ).toString()
  }

  async connect(pathInfo: PathInfo, signal: AbortSignal) {
    return WsConnection.connect(await this.dynamicUrl(pathInfo), signal)
  }

  async connectionCode(pathInfo: PathInfo, isTypes: boolean) {
    const url = this.staticUrl(pathInfo)
    return `
import * as C from "./capi.js"

export const connectionCtor ${isTypes ? `: typeof C.WsConnection` : `= C.WsConnection`}
export const discoveryValue ${isTypes ? ":" : "="} "${url}"
    `
  }
}
