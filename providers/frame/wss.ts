import { PathInfo } from "../../server/mod.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export class WssProvider extends FrameProxyProvider {
  async dynamicUrl(pathInfo: PathInfo) {
    return this.staticUrl(pathInfo)
  }

  override staticUrl(pathInfo: PathInfo) {
    return `wss://${pathInfo.target}`
  }
}
