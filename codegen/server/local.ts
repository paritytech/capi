import { Cache, FsCache } from "./cache.ts"
import { getModuleIndex } from "./git_utils.ts"
import { CodegenServer } from "./server.ts"

export class LocalCodegenServer extends CodegenServer {
  version = "local"
  cache: Cache = new FsCache("target/codegen", this.abortController.signal)
  localChainSupport = true

  async defaultVersion() {
    return this.version
  }

  async versionSuggestions() {
    return ["local"]
  }

  async delegateRequest(): Promise<Response> {
    return this.e404()
  }

  moduleIndex = getModuleIndex
  async moduleFile(request: Request, path: string, key: string): Promise<Response> {
    return this.ts(request, key, async () => {
      const res = await fetch(new URL("../.." + path, import.meta.url))
      if (!res.ok) throw this.e404()
      return res.text()
    })
  }
}

if (import.meta.main) {
  new LocalCodegenServer().listen(5646)
}
