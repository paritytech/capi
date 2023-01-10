import { CodegenCtx, Ext, File } from "../../../codegen/mod.ts"
import { fromPrefixedHex } from "../../../frame_metadata/mod.ts"
import { Client } from "../../../rpc/mod.ts"
import * as U from "../../../util/mod.ts"
import { Provider } from "./Base.ts"

export interface FrameProviderPathInfo<DiscoveryValue> {
  key: string
  discoveryValue: DiscoveryValue
  version: string
  filePath: string
  ext: Ext
}

export abstract class FrameProvider<DiscoveryValue> extends Provider {
  codegenCtxPendings: Record<string, Promise<CodegenCtx>> = {}

  abstract parsePathInfo(path: string): FrameProviderPathInfo<DiscoveryValue>
  abstract client(pathInfo: FrameProviderPathInfo<DiscoveryValue>): U.PromiseOr<Client>
  abstract clientFile(pathInfo: FrameProviderPathInfo<DiscoveryValue>): File

  async run(req: Request, path: string) {
    const pathInfo = this.parsePathInfo(path)
    const codegenCtx = await this.codegenCtx(pathInfo)
    const file = codegenCtx.files.get(pathInfo.filePath)
    if (!file) throw new Error()
    return this.ctx.code(req, pathInfo.filePath, file.code)
  }

  codegenCtx(pathInfo: FrameProviderPathInfo<DiscoveryValue>) {
    let codegenCtxPending = this.codegenCtxPendings[pathInfo.key]
    if (!codegenCtxPending) {
      codegenCtxPending = (async () => {
        const client = await this.client(pathInfo)
        const versionR = U.throwIfError(
          await client.call<string>(client.providerRef.nextId(), "system_version", []),
        )
        if (versionR.error) throw new Error(versionR.error.message)
        if (`v${versionR.result.split("-")[0]}` !== pathInfo.version) throw new Error()
        const metadataR = U.throwIfError(
          await client.call<string>(client.providerRef.nextId(), "state_getMetadata", []),
        )
        if (metadataR.error) throw new Error(metadataR.error.message)
        const metadata = fromPrefixedHex(metadataR.result)
        return new CodegenCtx({
          metadata,
          capiUrl: new URL(import.meta.resolve("../../mod.ts")),
          clientFile: this.clientFile(pathInfo),
        })
      })()
      this.codegenCtxPendings[pathInfo.key] = codegenCtxPending
    }
    return codegenCtxPending
  }
}
