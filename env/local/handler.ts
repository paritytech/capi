import { Handler } from "../../deps/std/http/server.ts"
import { assertFilePath, assertVRuntime, parsePathInfo } from "../PathInfo.ts"
import { ProviderBase } from "../provider/mod.ts"
import { ResponseFactories } from "../ResponseFactories.ts"
import { page } from "./common.ts"
import { LandingPage } from "./pages/mod.ts"

export function handler(f: ResponseFactories, providers: Record<string, ProviderBase>): Handler {
  return async (req) => {
    const url = new URL(req.url)
    const path = url.pathname.slice(1)
    if (path === "") {
      return page(LandingPage())
    }
    try {
      const pathInfo = parsePathInfo(path)
      if (pathInfo.vCapi) throw new Error()
      assertVRuntime(pathInfo)
      assertFilePath(pathInfo)
      const provider = providers[pathInfo.providerId]
      if (provider) {
        const codegen = await provider.target(pathInfo).codegen()
        const file = codegen.files.get(pathInfo.filePath)
        if (file) return f.code(req, pathInfo.filePath, file.code)
      }
      return f[500](req, `Unsupported provider "${pathInfo.providerId}"`)
    } catch (_e) {}
    for (const dir of staticDirs) {
      try {
        const url = new URL(path, dir)
        await Deno.lstat(url)
        return await f.staticFile(req, url)
      } catch (_e) {}
    }
    return f[404](req)
  }
}

const staticDirs = ["../../", "./static/"].map((p) => import.meta.resolve(p))
