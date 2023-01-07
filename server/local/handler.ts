import { ConnInfo } from "../../deps/std/http/server.ts"
import * as U from "../../util/mod.ts"
import { page } from "./common.ts"
import { Ctx } from "./Ctx.ts"
import { _404Page, LandingPage } from "./pages/mod.ts"

export async function handler(this: Ctx, req: Request, _connInfo: ConnInfo): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname.slice(1)
  if (path === "") {
    return page(LandingPage())
  }
  const pieces = U.splitFirst(path, "/")
  if (pieces) {
    const [e0, e1] = pieces
    const provider = this.providers.find(({ match }) => match[e0])
    if (provider) {
      return await provider.run(e1)
    }
  }
  for (const dir of staticDirs) {
    try {
      const url = new URL(path, dir)
      await Deno.lstat(url)
      return await this.staticFile(req, url)
    } catch (_e) {}
  }
  return this[404](req)
}

const staticDirs = ["../../", "./static/"].map((p) => import.meta.resolve(p))
