import { escapeHtml } from "../deps/escape.ts"
import { highlighterPromise } from "../deps/shiki.ts"
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
        "X-TypeScript-Types": request.url.slice(0, -3) + ".d.ts",
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
  const highlighter = await highlighterPromise
  const tokens = highlighter.codeToThemedTokens(code, "ts")
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
      <pre class="shiki"><code>${codeContent}</code></pre>
    </body>
  `
}
