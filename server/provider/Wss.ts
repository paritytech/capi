import { Client, proxyProvider } from "../../rpc/mod.ts"
import { Provider, TryParsePathInfoResult } from "./common.ts"

export interface WssPathInfo {
  ws: string
  runtimeVersion: string
  tsFilePath: string
}

export class WssProvider extends Provider<WssPathInfo> {
  #client?: Client<string, Event, Event, Event>

  tryParsePathInfo(path: string): TryParsePathInfoResult<WssPathInfo> {
    const atI = path.search("@")
    if (atI == -1) return { error: `Expected "@" character and version to appear in URL` }
    const ws = path.slice(0, atI)
    const atTrailing = path.slice(atI + 1)
    const slashI = atTrailing.search("/")
    const runtimeVersion = atTrailing.slice(0, slashI)
    const tsFilePath = atTrailing.slice(slashI + 1)
    return { ws, runtimeVersion, tsFilePath }
  }

  client(pathInfo: WssPathInfo) {
    if (!this.#client) {
      this.#client = new Client(proxyProvider, `wss://${pathInfo.ws}`)
    }
    return this.#client
  }

  code(path: WssPathInfo) {
    return ""
  }
}
