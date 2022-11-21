import { FsCache } from "./cache.ts"
import { getModuleIndex } from "./git_utils.ts"
import { CodegenServer } from "./server.ts"

export class LocalCodegenServer extends CodegenServer {
  version = "local"
  cache = new FsCache("target/codegen")
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
    const res = await fetch(new URL("../.." + path, import.meta.url))
    if (!res.ok) return this.e404()
    return this.ts(request, key, await res.text())
  }
}

if (import.meta.main) {
  new LocalCodegenServer().listen(5646)
}
