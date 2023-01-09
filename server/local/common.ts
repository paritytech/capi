import { JSX } from "../../deps/preact.ts"
import { renderToString } from "../../deps/preact_render_to_string.ts"

export function page(element: JSX.Element): Response {
  return new Response(renderToString(element), {
    headers: { "Content-Type": "text/html" },
  })
}

export function acceptsHtml(request: Request): boolean {
  return request.headers.get("Accept")?.split(",").includes("text/html") ?? false
}
