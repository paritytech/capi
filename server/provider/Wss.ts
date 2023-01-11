import { Ext, File } from "../../codegen/mod.ts"
import { outdent } from "../../deps/outdent.ts"
import * as path from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { FrameProvider, FrameSubpathInfo } from "./common/mod.ts"

export interface WssSubpathInfo extends FrameSubpathInfo {
  protocolTrailing: string
}

export class WssProvider extends FrameProvider {
  parseSubpathInfo = parseWssSubpathInfo

  url({ protocolTrailing }: WssSubpathInfo) {
    return `wss://${protocolTrailing}`
  }

  client(info: WssSubpathInfo) {
    return new Client(proxyProvider, this.url(info))
  }

  clientFile(info: WssSubpathInfo) {
    const clientFile = new File()
    clientFile.code = outdent`
      import * as C from "../capi.ts"

      export const client = new C.Client(C.rpc.proxyProvider, "${this.url(info)}")
    `
    return clientFile
  }
}

export function parseWssSubpathInfo(subpath: string): WssSubpathInfo {
  const atI = subpath.indexOf("@")
  if (atI === -1) throw new Error(`Expected "@" character to appear in URL`)
  const protocolTrailing = subpath.slice(0, atI)
  const atTrailing = subpath.slice(atI + 1)
  const slashI = atTrailing.indexOf("/")
  const version = atTrailing.slice(0, slashI)
  const filePath = atTrailing.slice(slashI + 1)
  const chainKey = subpath.slice(0, atI + 1 + slashI)
  const ext = path.extname(filePath) as Ext
  return { chainKey, protocolTrailing, version, filePath, ext }
}
