import { JSX } from "../../deps/preact.ts"
import { renderToString } from "../../deps/preact_render_to_string.ts"
import { accepts } from "../../deps/std/http/negotiation.ts"

export function page(element: JSX.Element): Response {
  return new Response(renderToString(element), {
    headers: { "Content-Type": "text/html" },
  })
}

export function acceptsHtml(req: Request): boolean {
  return !!accepts(req, "text/html")
}
