import { JSX } from "../deps/preact.ts"
import { renderToString } from "../deps/preact_render_to_string.ts"
import { serveFile } from "../deps/std/http/file_server.ts"
import { Status } from "../deps/std/http/http_status.ts"
import * as U from "../util/mod.ts"
import { CodePage, FiveHundredPage, FourOFourPage } from "./pages/mod.ts"

export async function staticFile(req: Request, url: URL): Promise<Response> {
  const { pathname: path } = url
  if (acceptsHtml(req)) {
    return page(await CodePage({ path, src: await Deno.readTextFile(url) }))
  }
  return await serveFile(req, path)
}

export async function code(req: Request, path: string, src: string): Promise<Response> {
  if (acceptsHtml(req)) {
    return page(await CodePage({ path, src }))
  }
  return new Response(src, {
    headers: { "Content-Type": "application/typescript" },
  })
}

export function fourOFour(req: Request): U.PromiseOr<Response> {
  if (acceptsHtml(req)) {
    return page(FourOFourPage({}))
  }
  return new Response("404", { status: Status.NotFound })
}

export function fiveHundred(req: Request, message?: string): U.PromiseOr<Response> {
  if (acceptsHtml(req)) {
    return page(FiveHundredPage({ message }))
  }
  return new Response("500", { status: Status.InternalServerError })
}

export function page(element: JSX.Element): Response {
  return new Response(renderToString(element), {
    headers: { "Content-Type": "text/html" },
  })
}

export function acceptsHtml(request: Request): boolean {
  return request.headers.get("Accept")?.split(",").includes("text/html") ?? false
}
