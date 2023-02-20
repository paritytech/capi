import { File, FrameCodegen } from "../../codegen/frame/mod.ts"
import { posix as path } from "../../deps/std/path.ts"
import { $metadata } from "../../frame_metadata/Metadata.ts"
import { fromPrefixedHex } from "../../frame_metadata/mod.ts"
import { Connection, ServerError } from "../../rpc/mod.ts"
import { f, PathInfo, Provider } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { WeakMemo } from "../../util/mod.ts"
import { withSignal } from "../../util/withSignal.ts"

export abstract class FrameProvider extends Provider {
  generatorId = "frame"

  codegenCtxsPending: Record<string, Promise<FrameCodegen>> = {}

  abstract connect(pathInfo: PathInfo, signal: AbortSignal): Promise<Connection>
  abstract chainFile(pathInfo: PathInfo): Promise<File>

  async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    const { vRuntime, filePath } = pathInfo
    if (!vRuntime) return f.serverError("Must specify vRuntime")
    if (!filePath) {
      return f.redirect(fromPathInfo({
        ...pathInfo,
        filePath: "mod.ts",
      }))
    }
    if (vRuntime === "latest") {
      return f.redirect(fromPathInfo({
        ...pathInfo,
        vRuntime: await this.latestVersion(pathInfo),
      }))
    }
    if (filePath === "capi.ts") {
      const capiPath = path.relative(path.dirname(new URL(request.url).pathname), "/mod.ts")
      return f.code(
        this.env.cache,
        request,
        async () => `export * from ${JSON.stringify(capiPath)}`,
      )
    }
    return await f.code(this.env.cache, request, async () => {
      const codegen = await this.codegen(pathInfo)
      const file = codegen.files.get(filePath)
      if (!file) throw f.notFound()
      return file.code(filePath)
    })
  }

  // TODO: memo
  async latestVersion(pathInfo: PathInfo) {
    const version = await this.call<string>(pathInfo, "system_version", [])
    return this.normalizeRuntimeVersion(version)
  }

  normalizeRuntimeVersion(version: string) {
    return "v" + version.split("-")[0]!
  }

  cacheKey(pathInfo: PathInfo) {
    return fromPathInfo({ ...pathInfo, filePath: "" })
  }

  codegenMemo = new WeakMemo<string, FrameCodegen>()
  codegen(pathInfo: PathInfo) {
    return this.codegenMemo.run(this.cacheKey(pathInfo), async () => {
      const metadata = await this.getMetadata(pathInfo)
      const chainFile = await this.chainFile(pathInfo)
      return new FrameCodegen({ metadata, chainFile })
    })
  }

  async getMetadata(pathInfo: PathInfo) {
    return this.env.cache.get(
      `${this.cacheKey(pathInfo)}/metadata`,
      $metadata,
      async () => {
        if (pathInfo.vRuntime !== await this.latestVersion(pathInfo)) {
          throw f.serverError("Cannot get metadata for old runtime version")
        }
        const metadata = fromPrefixedHex(
          await this.call(pathInfo, "state_getMetadata", []),
        )
        return metadata
      },
    )
  }

  async call<T>(
    pathInfo: PathInfo,
    method: string,
    params: unknown[] = [],
  ): Promise<T> {
    return withSignal(async (signal) => {
      const connection = await this.connect(pathInfo, signal)
      const result = await connection.call(method, params)
      if (result.error) throw new ServerError(result)
      return result.result as T
    })
  }
}
