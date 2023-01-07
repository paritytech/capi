import { serveFile } from "../../deps/std/http/file_server.ts"
import { Status } from "../../deps/std/http/http_status.ts"
import { FsCache } from "../../util/cache/mod.ts"
import { CtxBase, PolkadotDevProvider, WsProvider } from "../mod.ts"
import { acceptsHtml, page } from "./common.ts"
import { _404Page, _500Page, CodePage } from "./pages/mod.ts"

export class Ctx extends CtxBase<LocalProvider> {
  constructor(cacheDir: string, signal: AbortSignal) {
    super(new FsCache(cacheDir, signal), providers(), signal)
  }

  async 404(req: Request) {
    if (acceptsHtml(req)) {
      return page(_404Page({}))
    }
    return new Response("404", { status: Status.NotFound })
  }

  async 500(req: Request, message?: string) {
    if (acceptsHtml(req)) {
      return page(_500Page({ message }))
    }
    return new Response("500", { status: Status.InternalServerError })
  }

  async staticFile(req: Request, url: URL) {
    if (acceptsHtml(req)) {
      return page(
        await CodePage({
          path: url.pathname,
          code: await Deno.readTextFile(url),
        }),
      )
    }
    return await serveFile(req, url.pathname)
  }

  async codegen(path: string) {
    return ""
  }

  completions() {
    return Promise.resolve("")
  }
}

type LocalProvider = ReturnType<typeof providers>[number]
function providers() {
  return [new PolkadotDevProvider(), new WsProvider()]
}
