import { File, FrameCodegen } from "../../codegen/mod.ts"
import { fromPrefixedHex } from "../../frame_metadata/mod.ts"
import { Client } from "../../rpc/mod.ts"
import { PathInfo, Provider } from "../../server/mod.ts"
import * as U from "../../util/mod.ts"
import { WeakMemo } from "../../util/mod.ts"

export abstract class FrameProvider extends Provider {
  generatorId = "frame"

  codegenCtxsPending: Record<string, Promise<FrameCodegen>> = {}

  abstract client(pathInfo: PathInfo): U.PromiseOr<Client>
  abstract clientFile(pathInfo: PathInfo): U.PromiseOr<File>

  codegenMemo = new WeakMemo<string, FrameCodegen>()
  codegen(pathInfo: PathInfo) {
    return this.codegenMemo.run(this.cacheKey(pathInfo), async () => {
      const { vRuntime, src } = pathInfo
      const client_ = await this.client(pathInfo)
      const vRuntime_ = vRuntime ?? await (async () => {
        const vRuntimeR = U.throwIfError(
          await client_.call<string>(client_.providerRef.nextId(), "system_version", []),
        )
        if (vRuntimeR.error) throw new Error(vRuntimeR.error.message)
        const split = vRuntimeR.result.split("-")
        if (split.length !== 2) {
          throw new Error(`Failed to retrieve latest runtime info from "${src}"`)
        }
        return split[1]!
      })()
      const [semver, blockNum] = vRuntime_.split("-")
      if (!semver) throw new Error(`Failed to parse version \`${vRuntime_}\``)
      const blockHash = U.throwIfError(
        await client_.call(client_.providerRef.nextId(), "chain_getBlockHash", [blockNum]),
      )
      if (blockHash.error) throw new Error(blockHash.error.message)
      console.log(blockHash.result)
      if (true as boolean) {
        Deno.exit()
      }
      const metadataR = U.throwIfError(
        await client_.call<string>(client_.providerRef.nextId(), "state_getMetadata", []),
      )
      if (metadataR.error) throw new Error(metadataR.error.message)
      const metadata = fromPrefixedHex(metadataR.result)
      const clientFile = await this.clientFile(pathInfo)
      return new FrameCodegen({ metadata, clientFile })
    })
  }
}

async function versionInfo(client: Client) {
  const [systemVersionRaw, blockNum] = await Promise.all([
    handleError(client.call<string>(client.providerRef.nextId(), "system_version", [])),
    handleError(client.call<string>(client.providerRef.nextId(), "chain_getBlock", [])),
  ])
  return { semver: systemVersionRaw.split("-"), blockNum }
}

async function handleError<R extends ReturnType<Client["call"]>>(r: R): Promise<string> {
  const result = U.throwIfError(await r)
  if (result.error) throw new Error(result.error.message)
  return result.result as string
}
