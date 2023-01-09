import { serveFile } from "../../deps/std/http/file_server.ts"
import { Status } from "../../deps/std/http/http_status.ts"
import { FsCache } from "../../util/cache/mod.ts"
import { PolkadotDevProvider, ServerCtxBase, WssProvider } from "../mod.ts"
import { acceptsHtml, page } from "./common.ts"
import { _404Page, _500Page, CodePage } from "./pages/mod.ts"

export class ServerCtx extends ServerCtxBase<{
  dev: PolkadotDevProvider
  wss: WssProvider
}> {
  constructor(cacheDir: string, signal: AbortSignal) {
    super(new FsCache(cacheDir, signal), {
      dev: new PolkadotDevProvider(),
      wss: new WssProvider(),
    }, signal)
  }

  async staticFile(req: Request, url: URL) {
    const { pathname: path } = url
    if (acceptsHtml(req)) {
      return page(await CodePage({ path, src: await Deno.readTextFile(url) }))
    }
    return await serveFile(req, path)
  }

  async code(req: Request, path: string, src: string) {
    if (acceptsHtml(req)) {
      return page(await CodePage({ path, src }))
    }
    return new Response(src, {
      headers: { "Content-Type": "application/typescript" },
    })
  }

  404(req: Request) {
    if (acceptsHtml(req)) {
      return page(_404Page({}))
    }
    return new Response("404", { status: Status.NotFound })
  }

  500(req: Request, message?: string) {
    if (acceptsHtml(req)) {
      return page(_500Page({ message }))
    }
    return new Response("500", { status: Status.InternalServerError })
  }
}
