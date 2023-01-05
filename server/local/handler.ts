import { ConnInfo } from "../../deps/std/http/server.ts"
import { Ctx } from "../Ctx.ts"
import { page } from "../response.ts"
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
    return new Response("No provider matched")
  }
  const providerTarget = path.slice(slashI + 1)
  const pathInfo = provider.tryParsePathInfo(providerTarget)
  if (pathInfo.error) {
    return page(_404Page({ message: pathInfo.error }))
  }
  console.log({ [providerId]: providerTarget })
  return await Promise.resolve(new Response())
}
