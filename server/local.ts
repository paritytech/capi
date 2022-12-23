import { PermanentMemo } from "../util/memo.ts"
import { Cache, FsCache } from "./cache.ts"
import { CapiCodegenServer } from "./capi_repo.ts"
import { getModuleIndex } from "./git_utils.ts"

const R_DENO_LAND_URL = /^https:\/\/deno\.land\/x\/capi@(v[^\/]+)\//
const R_GITHUB_URL = /^https:\/\/raw\.githubusercontent\.com\/paritytech\/capi\/([0-9a-f]+)\//

export class LocalCapiCodegenServer extends CapiCodegenServer {
  mainVersion
  cache: Cache = new FsCache("target/codegen", this.abortController.signal)
  local = true

  constructor(version?: string) {
    super()
    this.mainVersion = version ?? this.detectVersion()
  }

  detectVersion() {
    const url = import.meta.url
    if (url.startsWith("file://")) return "local"
    const denoMatch = R_DENO_LAND_URL.exec(url)
    if (denoMatch) {
      const [, version] = denoMatch
      return version!
    }
    const githubMatch = R_GITHUB_URL.exec(url)
    if (githubMatch) {
      const [, sha] = githubMatch
      return `sha:${sha}`
    }
    throw new Error("Could not detect version from url " + url)
  }

  defaultVersion() {
    return Promise.resolve(this.mainVersion)
  }

  deploymentUrlMemo = new PermanentMemo<string, string>()
  deploymentUrl(version: string) {
    return this.deploymentUrlMemo.run(version, async () => {
      const mod = await import(await this.moduleFileUrl(version, "/server/local.ts"))
      const Server = mod.LocalCapiCodegenServer as typeof LocalCapiCodegenServer
      const server = new Server(version)
      this.abortController.signal.addEventListener("abort", () => {
        server.abortController.abort()
      })
      let port: number
      server.listen(0, (x) => port = x.port)
      return `http://localhost:${port!}`
    })
  }

  moduleIndex = getModuleIndex
}
