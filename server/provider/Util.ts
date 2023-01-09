import { Client } from "../../rpc/mod.ts"
import { Provider, TryParsePathInfoResult } from "./common.ts"

export interface UtilPathInfo {}

export class UtilProvider extends Provider<UtilPathInfo> {
  #client?: Client<string, Event, Event, Event>

  tryParsePathInfo(path: string): TryParsePathInfoResult<UtilPathInfo> {
    return {}
  }

  code(path: UtilPathInfo) {
    return devClient("TODO")
  }
}

function devClient(url: string) {
  return `import * as C from "${new URL(import.meta.resolve("../../mod.ts")).href}"

  export const client = new C.Client(C.rpc.proxyProvider, "${url}")
`
}
