import { JSX } from "../../deps/preact.ts"
import { renderToString } from "../../deps/preact_render_to_string.ts"
import { serveFile } from "../../deps/std/http/file_server.ts"
import { accepts } from "../../deps/std/http/negotiation.ts"
import { serve as serveHttp } from "../../deps/std/http/server.ts"
import { FsCache } from "../../util/cache/mod.ts"
import { Ctx } from "../Ctx.ts"
import { PolkadotDevProvider } from "../provider/mod.ts"

export interface ServeProps {
  signal: AbortSignal
  port: number
}

export async function serve({ signal, port }: ServeProps) {
  const cache = new FsCache(await Deno.makeTempDir({ prefix: "capi_server_" }), signal)
  const frameCtx = new Ctx(cache, [new PolkadotDevProvider()], signal)

  return await serveHttp((req) => {
    const url = new URL(req.url)
    const path = url.pathname.slice(1)
    const slashI = path.search("/")
    const providerId = path.slice(0, slashI)
    console.log({ providerId })
    return new Response()
  }, {
    port,
    onListen() {
      console.log(`Capi server listening on http://localhost:${port}`)
    },
  })
}

// const handlers: {
//   [K in keyof RouteInfoLookup]: (props: RouteInfoLookup[K]) => Response | Promise<Response>
// } = {
//   FrameChainTs() {
//     return new Response()
//   },
//   FrameChainTsCompletions() {
//     return new Response()
//   },
//   FrameCompassTypeCompletions() {
//     return new Response()
//   },
//   FrameCompassUriCompletions() {
//     return new Response()
//   },
//   FrameCompassVersionCompletions() {
//     return new Response()
//   },
//   IntellisenseManifest() {
//     return new Response()
//   },
//   LandingPage() {
//     return new Response()
//   },
//   Other() {
//     return new Response()
//   },
// }
