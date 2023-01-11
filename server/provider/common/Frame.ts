import { CodegenCtx, Ext, File } from "../../../codegen/mod.ts"
import { fromPrefixedHex } from "../../../frame_metadata/mod.ts"
import { Client } from "../../../rpc/mod.ts"
import * as U from "../../../util/mod.ts"
import { Provider } from "./Base.ts"

export interface FrameSubpathInfo {
  chainKey: string
  version: string
  filePath: string
  ext: Ext
}

export abstract class FrameProvider extends Provider {
  codegenCtxPendings: Record<string, Promise<CodegenCtx>> = {}

  abstract parseSubpathInfo(path: string): FrameSubpathInfo
  abstract client(info: FrameSubpathInfo): U.PromiseOr<Client>
  abstract clientFile(info: FrameSubpathInfo): U.PromiseOr<File>

  async run(req: Request, path: string) {
    const pathInfo = this.parseSubpathInfo(path)
    const codegenCtx = await this.codegenCtx(pathInfo)
    const file = codegenCtx.files.get(pathInfo.filePath)
    if (!file) throw new Error()
    return this.ctx.code(req, pathInfo.filePath, file.code)
  }

  codegenCtx(info: FrameSubpathInfo) {
    let codegenCtxPending = this.codegenCtxPendings[info.chainKey]
    if (!codegenCtxPending) {
      codegenCtxPending = (async () => {
        const client = await this.client(info)
        const versionR = U.throwIfError(
          await client.call<string>(client.providerRef.nextId(), "system_version", []),
        )
        if (versionR.error) throw new Error(versionR.error.message)
        if (`v${versionR.result.split("-")[0]}` !== info.version) throw new Error()
        const metadataR = U.throwIfError(
          await client.call<string>(client.providerRef.nextId(), "state_getMetadata", []),
        )
        if (metadataR.error) throw new Error(metadataR.error.message)
        const metadata = fromPrefixedHex(metadataR.result)
        const codegenCtx = new CodegenCtx({
          metadata,
          capiUrl: new URL(import.meta.resolve("../../mod.ts")),
          clientFile: await this.clientFile(info),
        })
        this.postInitCodegenCtx(codegenCtx, info)
        return codegenCtx
      })()
      this.codegenCtxPendings[info.chainKey] = codegenCtxPending
    }
    return codegenCtxPending
  }

  postInitCodegenCtx(_codegenCtx: CodegenCtx, _info: FrameSubpathInfo) {}
}
