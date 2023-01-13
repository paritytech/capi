import { serveFile } from "../../deps/std/http/file_server.ts"
import { Status } from "../../deps/std/http/http_status.ts"
import { ResponseFactories } from "../ResponseFactories.ts"
import { acceptsHtml, page } from "./common.ts"
import { CodePage, FiveHundredPage, FourOFourPage } from "./pages/mod.ts"

export const responseFactories: ResponseFactories = {
  async staticFile(req, url) {
    const { pathname: path } = url
    if (acceptsHtml(req)) {
      return page(await CodePage({ path, src: await Deno.readTextFile(url) }))
    }
    return await serveFile(req, path)
  },

  async code(req, path, src) {
    if (acceptsHtml(req)) {
      return page(await CodePage({ path, src }))
    }
    return new Response(src, {
      headers: { "Content-Type": "application/typescript" },
    })
  },

  404(req) {
    if (acceptsHtml(req)) {
      return page(FourOFourPage({}))
    }
    return new Response("404", { status: Status.NotFound })
  },

  500(req, message) {
    if (acceptsHtml(req)) {
      return page(FiveHundredPage({ message }))
    }
    return new Response("500", { status: Status.InternalServerError })
  },
}
