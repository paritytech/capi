import { PermanentMemo } from "../../util/memo.ts"
import { Cache, FsCache } from "./cache.ts"
import { CapiCodegenServer } from "./capi_repo.ts"
import { getModuleIndex } from "./git_utils.ts"

export class LocalCapiCodegenServer extends CapiCodegenServer {
  version
  cache: Cache = new FsCache("target/codegen", this.abortController.signal)
  local = true

  constructor(version?: string) {
    super()
    this.version = version ?? this.detectVersion()
  }

  rDenoLandUrl = /^https:\/\/deno\.land\/x\/capi@(v[^\/]+)\//
  rGithubUrl = /^https:\/\/raw\.githubusercontent\.com\/paritytech\/capi\/([0-9a-f]+)\//
  detectVersion() {
    const url = import.meta.url
    if (url.startsWith("file://")) return "local"
    const denoMatch = this.rDenoLandUrl.exec(url)
    if (denoMatch) {
      const [, version] = denoMatch
      return version!
    }
    const githubMatch = this.rGithubUrl.exec(url)
    if (githubMatch) {
      const [, sha] = githubMatch
      return `sha:${sha}`
    }
    throw new Error("Could not detect version from url " + url)
  }

  async defaultVersion() {
    return this.version
  }

  deploymentUrlMemo = new PermanentMemo<string, string>()
  async deploymentUrl(version: string) {
    return this.deploymentUrlMemo.run(version, async () => {
      const mod = await import(this.moduleFileUrl(version, "/codegen/server/local.ts"))
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

if (import.meta.main) {
  new LocalCapiCodegenServer().listen(5646)
}
