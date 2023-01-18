import { Codegen, File } from "../../codegen/mod.ts"
import { outdent } from "../../deps/outdent.ts"
import { fromPrefixedHex } from "../../frame_metadata/mod.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import * as U from "../../util/mod.ts"
import { assertVRuntime } from "../PathInfo.ts"
import { ProviderBase, ProviderRunBase } from "./Base.ts"

export abstract class FrameProviderBase extends ProviderBase {
  codegenCtxsPending: Record<string, Promise<Codegen>> = {}
}

export abstract class FrameTargetBase<Provider extends FrameProviderBase>
  extends ProviderRunBase<Provider>
{
  abstract client(): U.PromiseOr<Client>
  abstract clientFile(): U.PromiseOr<File>
  abstract rawClientFile(): U.PromiseOr<File>

  codegen() {
    const { provider, pathInfo } = this
    const { targetKey } = pathInfo
    let codegenCtxPending = provider.codegenCtxsPending[targetKey]
    if (!codegenCtxPending) {
      codegenCtxPending = (async () => {
        const client_ = await this.client()
        if (this.pathInfo.vRuntime) {
          const vRuntimeR = U.throwIfError(
            await client_.call<string>(client_.providerRef.nextId(), "system_version", []),
          )
          if (vRuntimeR.error) throw new Error(vRuntimeR.error.message)
          // assertVRuntime(pathInfo, `v${vRuntimeR.result.split("-")[0]}`)
        }
        const metadataR = U.throwIfError(
          await client_.call<string>(client_.providerRef.nextId(), "state_getMetadata", []),
        )
        if (metadataR.error) throw new Error(metadataR.error.message)
        const metadata = fromPrefixedHex(metadataR.result)
        const [clientFile, rawClientFile] = await Promise.all([
          this.clientFile(),
          this.rawClientFile(),
        ])
        return new Codegen({ metadata, clientFile, rawClientFile })
      })()
      provider.codegenCtxsPending[targetKey] = codegenCtxPending
    }
    return codegenCtxPending
  }
}

export function getClient(this: { url: string }) {
  return new Client(proxyProvider, this.url)
}

export function getClientFile(this: { url: string }) {
  const file = new File()
  file.codeRaw = outdent`
    import * as C from "../capi.ts"

    export const client = C.rpcClient(C.rpc.proxyProvider, "${this.url}")
  `
  return file
}

export function getRawClientFile(this: { url: string }) {
  const file = new File()
  file.codeRaw = outdent`
    import * as C from "../capi.ts"

    export const client = new C.rpc.Client(C.rpc.proxyProvider, "${this.url}")
  `
  return file
}
