import { serve as serveHttp } from "../../deps/std/http/server.ts"
import { FsCache } from "../../util/cache/mod.ts"
import { Ctx } from "../Ctx.ts"
import { PolkadotDevProvider } from "../provider/mod.ts"
import { page } from "../response.ts"
import { handler } from "./handler.ts"
import { _500Page } from "./pages/mod.ts"

export async function serve(port: number, signal: AbortSignal) {
  const cache = new FsCache(await Deno.makeTempDir({ prefix: "capi_server_" }), signal)
  const ctx = new Ctx(cache, [new PolkadotDevProvider()], signal)
  await serveHttp(handler.bind(ctx), {
    port,
    onListen,
    onError,
  })
}

function onListen({ port }: { port: number }) {
  console.log(`Capi server listening on http://localhost:${port}`)
}

function onError(error: unknown): Response {
  return page(_500Page({
    message: error instanceof Error ? error.message : JSON.stringify(error),
  }))
}
