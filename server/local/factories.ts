import { escapeHtml } from "../../deps/escape.ts"
import * as shiki from "../../deps/shiki.ts"
import { serveFile } from "../../deps/std/http/file_server.ts"
import { Status } from "../../deps/std/http/http_status.ts"
import * as U from "../../util/mod.ts"

shiki.setCDN("https://unpkg.com/shiki/")
export const highlighterPromise = shiki.getHighlighter({ theme: "github-dark", langs: ["ts"] })

export async function staticFile(req: Request, url: URL): Promise<Response> {
  const { pathname: path } = url
  if (acceptsHtml(req)) {
    return page(await codePage({ path, src: await Deno.readTextFile(url) }))
  }
  return await serveFile(req, path)
}

export async function code(req: Request, path: string, src: string): Promise<Response> {
  if (acceptsHtml(req)) {
    return page(await codePage({ path, src }))
  }
  return new Response(src, {
    headers: { "Content-Type": "application/typescript" },
  })
}

export async function redirect(path: string): Promise<Response> {
  if (path.startsWith("file://")) {
    return await fetch(path)
  }
  return new Response(null, {
    status: Status.Found,
    headers: { Location: path },
  })
}

export function notFound(): U.PromiseOr<Response> {
  return new Response("404", { status: Status.NotFound })
}

export function serverError(message?: string): U.PromiseOr<Response> {
  return new Response(message || "500", { status: Status.InternalServerError })
}

export function page(html: string): Response {
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  })
}

export function acceptsHtml(request: Request): boolean {
  return request.headers.get("Accept")?.split(",").includes("text/html") ?? false
}

export async function codePage({ path, src }: {
  path: string
  src: string
}) {
  const highlighter = await highlighterPromise
  const tokens = highlighter.codeToThemedTokens(src, "ts")
  let codeContent = ""
  for (const line of tokens) {
    codeContent += `<span class="line">`
    for (const token of line) {
      if (
        token.explanation?.every((value) =>
          value.scopes.some((scope) =>
            scope.scopeName === "meta.export.ts" || scope.scopeName === "meta.import.ts"
          )
          && value.scopes.some((scope) => scope.scopeName === "string.quoted.double.ts")
        )
      ) {
        codeContent += `<a style="color: ${token.color}" href="${
          escapeHtml(JSON.parse(token.content))
        }">${escapeHtml(token.content)}</a>`
      } else {
        codeContent += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
      }
    }
    codeContent += "</span>\n"
  }
  const STYLE = `body {
  color: ${highlighter.getForegroundColor()};
  background-color: ${highlighter.getBackgroundColor()};
}
.shiki {
  counter-reset: line;
  counter-increment: line 0;
}
.shiki .line::before {
  content: counter(line);
  counter-increment: line;
  width: 5ch;
  margin-right: 2ch;
  display: inline-block;
  text-align: right;
  color: rgba(115,138,148,.4)
}
a {
  text-decoration-color: transparent;
  transition: text-decoration-color .2s;
  text-underline-offset: 2px;
}
a:hover {
  text-decoration-color: currentColor;
}
`
  return `
    <style>${STYLE}</style>
    <body>
      <h3>
        <code>
          <a style="color:inherit" href="${escapeHtml(path)}">${path}</a>
        </code>
      </h3>
      <pre class="shiki"><code>${codeContent}</code></pre>
    </body>
  `
}
