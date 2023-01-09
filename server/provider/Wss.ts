import { CodegenCtx } from "../../codegen/mod.ts"
import * as C from "../../mod.ts"
import { Provider, TryParsePathInfoResult } from "./common.ts"

export interface WssPathInfo {
  wss: string
  runtimeVersion: string
  tsFilePath: string
  key: string
}

export class WssProvider extends Provider<WssPathInfo> {
  codegenCtxPendings: Record<string, Promise<CodegenCtx>> = {}

  tryParsePathInfo(path: string): TryParsePathInfoResult<WssPathInfo> {
    const atI = path.search("@")
    if (atI == -1) return { error: `Expected "@" character and version to appear in URL` }
    const wss = path.slice(0, atI)
    const atTrailing = path.slice(atI + 1)
    const slashI = atTrailing.search("/")
    const runtimeVersion = atTrailing.slice(0, slashI)
    const tsFilePath = atTrailing.slice(slashI + 1)
    const key = path.slice(0, atI + 1 + slashI)
    return { wss, runtimeVersion, tsFilePath, key }
  }

  async code(pathInfo: WssPathInfo) {
    const fileKey = pathInfo.tsFilePath.length - 3
    const codegenCtx = await this.codegenCtx(pathInfo)
    return codegenCtx.files.get(pathInfo.tsFilePath.slice(0, fileKey))!
  }

  codegenCtx({ key, wss, runtimeVersion }: WssPathInfo): Promise<CodegenCtx> {
    let codegenCtxPending = this.codegenCtxPendings[key]
    if (!codegenCtxPending) {
      codegenCtxPending = (async () => {
        const client = C.rpcClient(C.rpc.proxyProvider, `wss://${wss}`)
        const result = await C.Z.ls(C.metadata(client)(), C.rpcCall("system_version")(client)())
          .run()
        if (result instanceof Error) {
          throw new Error()
        }
        const [metadata, version] = result
        if (typeof version !== "string") throw new Error()
        const versionWithoutChannel = version.split("-")[0]
        if (versionWithoutChannel !== runtimeVersion) throw new Error()
        const baseDir = new URL("_/specific/")
        return new CodegenCtx({
          metadata,
          baseDir,
          capiMod: baseDir,
          clientMod: baseDir,
          clientRawMod: baseDir,
        })
      })()
      this.codegenCtxPendings[key] = codegenCtxPending
    }
    return codegenCtxPending
  }

  // client(pathInfo: WssPathInfo) {
  //   // let client =
  //   if (!this.#client) {
  //     this.#client = new Client(proxyProvider, `wss://${pathInfo.ws}`)
  //   }
  //   return this.#client
  // }
}
