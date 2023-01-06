import { serveFile } from "../../deps/std/http/file_server.ts"
import { ConnInfo } from "../../deps/std/http/server.ts"
import { page } from "./common.ts"
import { Ctx } from "./Ctx.ts"
import { _404Page, LandingPage } from "./pages/mod.ts"

export async function handler(this: Ctx, req: Request, _connInfo: ConnInfo): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname.slice(1)
  if (path == "") {
    return page(LandingPage())
  }
  const slashI = path.search("/")
  const providerId = path.slice(0, slashI)
  const provider = this.providers.find(({ providerMatches }) => providerMatches[providerId])
  if (!provider) {
    for (
      const dir of [
        import.meta.resolve("../../"),
        import.meta.resolve("./static/"),
      ]
    ) {
      try {
        const url = new URL(path, dir)
        await Deno.lstat(url)
        return await serveFile(req, url.pathname)
      } catch (_e) {}
    }
    return this[404](req)
  }
  const info = provider.tryParsePathInfo(path.slice(slashI + 1))
  if (info.error) {
    return this[500](req)
  }
  return await Promise.resolve(new Response("No error"))
}
