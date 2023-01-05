import { JSX } from "../deps/preact.ts"
import { renderToString } from "../deps/preact_render_to_string.ts"
import { serveFile } from "../deps/std/http/file_server.ts"
import { accepts } from "../deps/std/http/negotiation.ts"

export function page(element: JSX.Element): Response {
  const headers = new Headers()
  headers.append("Content-Type", "text/html")
  return new Response(renderToString(element), { headers })
}
