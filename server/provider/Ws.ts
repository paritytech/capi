import { Client, proxyProvider } from "../../rpc/mod.ts"
import { Provider, TryParsePathInfoResult } from "./common.ts"

export interface WsPathInfo {
  ws: string
  runtimeVersion: string
  tsFilePath: string
}

export class WsProvider extends Provider<WsPathInfo> {
  providerMatches = { ws: true, wss: true }
  #client?: Client<string, Event, Event, Event>

  tryParsePathInfo(path: string): TryParsePathInfoResult<WsPathInfo> {
    const atI = path.search("@")
    if (atI == -1) return { error: `Expected "@" character and version to appear in URL` }
    const ws = path.slice(0, atI)
    const atTrailing = path.slice(atI + 1)
    const slashI = atTrailing.search("/")
    const runtimeVersion = atTrailing.slice(0, slashI)
    const tsFilePath = atTrailing.slice(slashI + 1)
    return { ws, runtimeVersion, tsFilePath }
  }

  client(pathInfo: WsPathInfo): Promise<Client<any, any, any, any>> {
    if (!this.#client) {
      this.#client = new Client(proxyProvider, `ws://${pathInfo.ws}`)
    }
    return Promise.resolve(this.#client)
  }
}
