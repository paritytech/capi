import { File, FrameCodegen } from "../../codegen/mod.ts"
import { fromPrefixedHex } from "../../frame_metadata/mod.ts"
import { Client, known } from "../../rpc/mod.ts"
import { PathInfo, Provider } from "../../server/mod.ts"
import { PromiseOr, throwIfError, TimedMemo, WeakMemo } from "../../util/mod.ts"

export abstract class FrameProvider extends Provider {
  generatorId = "frame"

  codegenCtxsPending: Record<string, Promise<FrameCodegen>> = {}

  abstract client(pathInfo: PathInfo): PromiseOr<Client>
  abstract clientFile(pathInfo: PathInfo): PromiseOr<File>

  vRuntimeMemo = new TimedMemo<string, string>(2 * 60 * 1000, this.env.signal)
  vRuntime(pathInfo: PathInfo) {
    return this.vRuntimeMemo.run(
      this.cacheKey(pathInfo),
      async () => await this.version(await this.client(pathInfo)),
    )
  }

  codegenMemo = new WeakMemo<string, FrameCodegen>()
  codegen(pathInfo: PathInfo) {
    return this.codegenMemo.run(this.cacheKey(pathInfo), async () => {
      const { vRuntime } = pathInfo
      const client_ = await this.client(pathInfo)
      let version = await this.version(client_)
      let blockI = parseInt(
        (await this.clientCall<known.Header>(client_, "chain_getHeader")).number,
        16,
      )
      if (version !== vRuntime) {
        // TODO(tjjfvi): improve search with slice-narrowing strategy
        while (version !== vRuntime) {
          blockI -= 100
          version = await this.version(client_, blockI)
        }
      }
      const blockHash = await this.clientCall<string>(client_, "chain_getBlockHash", [blockI])
      const metadata = fromPrefixedHex(
        await this.clientCall(client_, "state_getMetadata", [blockHash]),
      )
      const clientFile = await this.clientFile(pathInfo)
      return new FrameCodegen({ metadata, clientFile })
    })
  }

  async clientCall<R>(client: Client, method: string, params: unknown[] = []): Promise<R> {
    const result = throwIfError(await client.call(client.providerRef.nextId(), method, params))
    if (result.error) throw new Error(result.error.message)
    return result.result as R
  }

  version = async (client: Client, blockNum?: number) => {
    const blockHash = typeof blockNum === "number"
      ? await this.clientCall(client, "chain_getBlockHash", [blockNum])
      : undefined
    return "v"
      + (await this.clientCall<string>(client, "system_version", [blockHash])).split("-")[0]!
  }
}
