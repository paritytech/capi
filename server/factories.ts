import { Status } from "../deps/std/http.ts"
import { CacheBase } from "../util/cache/base.ts"

const codeTtl = 60_000

export async function code(cache: CacheBase, request: Request, genCode: () => Promise<string>) {
  const path = new URL(request.url).pathname
  if (acceptsHtml(request)) {
    return html(
      await cache.getString(path + ".html", codeTtl, async () => {
        const code = await cache.getString(path, codeTtl, genCode)
        return renderCode(code)
      }),
    )
  }
  const code = await cache.getString(path, codeTtl, genCode)
  return new Response(code, {
    headers: path.endsWith(".js")
      ? {
        "Content-Type": "application/javascript",
        "X-TypeScript-Types": `./${path.split("/").at(-1)!.slice(0, -3)}.d.ts`,
      }
      : { "Content-Type": "application/typescript" },
  })
}

export async function redirect(path: string): Promise<Response> {
  if (path.startsWith("file://")) return await fetch(path)
  return new Response(null, {
    status: Status.Found,
    headers: { Location: path },
  })
}

export function notFound() {
  return new Response("404", { status: Status.NotFound })
}

export function badRequest() {
  return new Response("400", { status: Status.BadRequest })
}

export function serverError(message?: string) {
  return new Response(message || "500", { status: Status.InternalServerError })
}

export function html(html: string): Response {
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  })
}

export function acceptsHtml(request: Request): boolean {
  return request.headers.get("Accept")?.split(",").includes("text/html") ?? false
}

export async function renderCode(code: string) {
  return `
    <body>
      <pre>${code}</pre>
    </body>
  `
}
