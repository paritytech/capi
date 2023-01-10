import { Ext, File } from "../../codegen/mod.ts"
import { extname } from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { FrameProvider, FrameProviderPathInfo } from "./common/mod.ts"

export class WssProvider extends FrameProvider<string> {
  parsePathInfo = parseWssPathInfo

  client({ discoveryValue }: FrameProviderPathInfo<string>) {
    return new Client(proxyProvider, `wss://${discoveryValue}`)
  }

  clientFile() {
    const clientFile = new File()
    clientFile.code = `export const client = null!`
    return clientFile
  }
}

export function parseWssPathInfo(path: string): FrameProviderPathInfo<string> {
  const atI = path.search("@")
  if (atI == -1) throw new Error(`Expected "@" character and version to appear in URL`)
  const discoveryValue = path.slice(0, atI)
  const atTrailing = path.slice(atI + 1)
  const slashI = atTrailing.search("/")
  const version = atTrailing.slice(0, slashI)
  const filePath = atTrailing.slice(slashI + 1)
  const key = path.slice(0, atI + 1 + slashI)
  const ext = extname(filePath) as Ext
  return { key, discoveryValue, version, filePath, ext }
}
