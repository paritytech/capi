import { File } from "../../codegen/mod.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { PathInfo } from "../../server/mod.ts"
import * as U from "../../util/mod.ts"
import { FrameProvider } from "./Base.ts"

export abstract class FrameProxyProvider extends FrameProvider {
  abstract url(pathInfo: PathInfo): U.PromiseOr<string>

  cacheKey({ target }: PathInfo) {
    return target
  }

  async client(pathInfo: PathInfo) {
    const client = new Client(proxyProvider, await this.url(pathInfo))
    this.env.signal.addEventListener("abort", client.discard)
    return client
  }

  async clientFile(pathInfo: PathInfo) {
    const url = await this.url(pathInfo)
    return new File(`
      import * as C from "../capi.ts"

      export const client = C.rpcClient(C.rpc.proxyProvider, "${url}")

      export const rawClient = new C.rpc.Client(C.rpc.proxyProvider, "${url}")

      export const discoveryValue = "${url}"
    `)
  }
}
