import { JSX } from "../../deps/preact.ts"
import { renderToString } from "../../deps/preact_render_to_string.ts"
import { serveFile } from "../../deps/std/http/file_server.ts"
import { accepts } from "../../deps/std/http/negotiation.ts"
import { ConnInfo, serve as serveHttp } from "../../deps/std/http/server.ts"
import { FsCache } from "../../util/cache/mod.ts"
import { Ctx } from "../Ctx.ts"
import { PolkadotDevProvider } from "../provider/mod.ts"
import { _404Page } from "./pages/404.tsx"
import { _500Page } from "./pages/500.tsx"
import { LandingPage } from "./pages/Landing.tsx"

export interface ServeProps {
  signal: AbortSignal
  port: number
}

export async function serve({ signal, port }: ServeProps) {
  const cache = new FsCache(await Deno.makeTempDir({ prefix: "capi_server_" }), signal)
  const ctx = new Ctx(cache, [new PolkadotDevProvider()], signal)
  return await serveHttp(handler.bind(ctx), { port, onListen, onError })
}

async function handler(this: Ctx, req: Request, _connInfo: ConnInfo): Promise<Response> {
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
    return page(_404Page(pathInfo.error))
  }
  console.log({ [providerId]: providerTarget })
  return await Promise.resolve(new Response())
}

function onListen({ port }: { port: number }) {
  console.log(`Capi server listening on http://localhost:${port}`)
}

function onError(_error: unknown) {
  return page(_500Page())
}

function page(element: JSX.Element) {
  const headers = new Headers()
  headers.append("Content-Type", "text/html")
  return new Response(renderToString(element), { headers })
}
