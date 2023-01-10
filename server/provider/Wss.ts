import { Ext, File } from "../../codegen/mod.ts"
import { outdent } from "../../deps/outdent.ts"
import * as path from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { FramePathInfo, FrameProvider } from "./common/mod.ts"

export interface WssPathInfo extends FramePathInfo {
  protocolTrailing: string
}

export class WssProvider extends FrameProvider {
  parsePathInfo = parseWssPathInfo

  url({ protocolTrailing }: WssPathInfo) {
    return `wss://${protocolTrailing}`
  }

  client(pathInfo: WssPathInfo) {
    return new Client(proxyProvider, this.url(pathInfo))
  }

  clientFile(pathInfo: WssPathInfo) {
    const clientFile = new File()
    clientFile.code = outdent`
      import * as C from "../capi.ts"

      export const client = new C.Client(C.rpc.proxyProvider, "${this.url(pathInfo)}")
    `
    return clientFile
  }
}

export function parseWssPathInfo(path_: string): WssPathInfo {
  const atI = path_.search("@")
  if (atI == -1) throw new Error(`Expected "@" character to appear in URL`)
  const protocolTrailing = path_.slice(0, atI)
  const atTrailing = path_.slice(atI + 1)
  const slashI = atTrailing.search("/")
  const version = atTrailing.slice(0, slashI)
  const filePath = atTrailing.slice(slashI + 1)
  const chainKey = path_.slice(0, atI + 1 + slashI)
  const ext = path.extname(filePath) as Ext
  return { chainKey, protocolTrailing, version, filePath, ext }
}
