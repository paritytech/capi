import { File, FrameCodegen } from "../../codegen/mod.ts"
import { fromPrefixedHex } from "../../frame_metadata/mod.ts"
import { Client } from "../../rpc/mod.ts"
import { PathInfo, Provider } from "../../server/mod.ts"
import * as U from "../../util/mod.ts"

export abstract class FrameProvider extends Provider {
  generatorId = "frame"

  codegenCtxsPending: Record<string, Promise<FrameCodegen>> = {}

  abstract client(pathInfo: PathInfo): U.PromiseOr<Client>
  abstract clientFile(pathInfo: PathInfo): U.PromiseOr<File>
  abstract rawClientFile(pathInfo: PathInfo): U.PromiseOr<File>
  abstract cacheKey(pathInfo: PathInfo): string

  codegen(pathInfo: PathInfo) {
    const cacheKey = this.cacheKey(pathInfo)
    let codegenCtxPending = this.codegenCtxsPending[cacheKey]
    if (!codegenCtxPending) {
      codegenCtxPending = (async () => {
        const { vRuntime, src } = pathInfo
        const client_ = await this.client(pathInfo)
        if (vRuntime) {
          const vRuntimeR = U.throwIfError(
            await client_.call<string>(client_.providerRef.nextId(), "system_version", []),
          )
          if (vRuntimeR.error) throw new Error(vRuntimeR.error.message)
          const normalized = `v${vRuntimeR.result.split("-")[0]}`
          if (vRuntime !== normalized) {
            throw new Error(
              `\`vRuntime\` (${vRuntime}) of "${src}" different from live (${normalized})`,
            )
          }
        }
        const metadataR = U.throwIfError(
          await client_.call<string>(client_.providerRef.nextId(), "state_getMetadata", []),
        )
        if (metadataR.error) throw new Error(metadataR.error.message)
        const metadata = fromPrefixedHex(metadataR.result)
        const [clientFile, rawClientFile] = await Promise.all(
          [this.clientFile(pathInfo), this.rawClientFile(pathInfo)],
        )
        return new FrameCodegen({ metadata, clientFile, rawClientFile })
      })()
      this.codegenCtxsPending[cacheKey] = codegenCtxPending
    }
    return codegenCtxPending
  }
}
