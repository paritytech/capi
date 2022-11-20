import { FsCache } from "./cache.ts"
import { getModIndex } from "./getModIndex.ts"
import { CodegenServer } from "./server.ts"

export class LocalCodegenServer extends CodegenServer {
  version = "local"
  cache = new FsCache("target/codegen")
  modIndex = getModIndex()
  devChains = true
  async getDefaultVersion() {
    return this.version
  }
  async handleModRequest(request: Request, path: string): Promise<Response> {
    const res = await fetch(new URL("../.." + path, import.meta.url))
    if (!res.ok) return this.e404()
    return this.ts(request, await res.text())
  }
  async getVersionSuggestions() {
    return ["local"]
  }
  async delegateRequest(): Promise<Response> {
    return this.eUnimplemented()
  }
}

if (import.meta.main) {
  console.log("http://localhost:5646/")
  new LocalCodegenServer().listen(5646)
}
