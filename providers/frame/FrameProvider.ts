import { FrameCodegen } from "../../codegen/FrameCodegen.ts"
import { hex } from "../../crypto/mod.ts"
import { posix as path } from "../../deps/std/path.ts"
import { decodeMetadata, FrameMetadata } from "../../frame_metadata/mod.ts"
import { Connection, ServerError } from "../../rpc/mod.ts"
import { f, PathInfo, Provider } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { WeakMemo } from "../../util/mod.ts"
import { normalizeIdent } from "../../util/normalize.ts"
import { tsFormatter } from "../../util/tsFormatter.ts"
import { withSignal } from "../../util/withSignal.ts"

export abstract class FrameProvider extends Provider {
  codegenCtxsPending: Record<string, Promise<FrameCodegen>> = {}

  abstract connect(pathInfo: PathInfo, signal: AbortSignal): Promise<Connection>

  abstract connectionCode(pathInfo: PathInfo): Promise<string>

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
      const code = codegen.get(filePath)
      if (!code) throw f.notFound()
      return tsFormatter.formatText(filePath, code)
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

  codegenMemo = new WeakMemo<string, Map<string, string>>()
  codegen(pathInfo: PathInfo) {
    return this.codegenMemo.run(this.cacheKey(pathInfo), async () => {
      const [metadata, connectionCode, chainName] = await Promise.all([
        this.getMetadata(pathInfo),
        this.connectionCode(pathInfo),
        this.chainName(pathInfo),
      ])
      const files = new Map<string, string>()
      files.set("connection.ts", connectionCode)
      new FrameCodegen(metadata, chainName).write(files)
      return files
    })
  }

  metadataMemo = new WeakMemo<string, FrameMetadata>()
  async getMetadata(pathInfo: PathInfo) {
    return this.metadataMemo.run(this.cacheKey(pathInfo), async () => {
      const raw = await this.env.cache.getRaw(
        `${this.cacheKey(pathInfo)}/metadata`,
        async () => {
          if (pathInfo.vRuntime !== await this.latestVersion(pathInfo)) {
            throw f.serverError("Cannot get metadata for old runtime version")
          }
          return hex.decode(await this.call(pathInfo, "state_getMetadata", []))
        },
      )
      return decodeMetadata(raw)
    })
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

  async chainName(pathInfo: PathInfo) {
    return normalizeIdent(await this.call<string>(pathInfo, "system_chain"))
  }
}
