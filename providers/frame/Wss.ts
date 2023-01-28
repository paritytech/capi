import { PathInfo } from "../../server/mod.ts"
import { FrameProxyProvider } from "./ProxyBase.ts"

export class WssProvider extends FrameProxyProvider {
  providerId = "wss"

  url(pathInfo: PathInfo) {
    return `wss://${pathInfo.target}`
  }
}
