import { escapeHtml } from "../../../deps/escape.ts"
import { Fragment, h } from "../../../deps/preact.ts"
import * as shiki from "../../../deps/shiki.ts"

shiki.setCDN("https://unpkg.com/shiki/")
export const highlighterPromise = shiki.getHighlighter({ theme: "github-dark", langs: ["ts"] })

export async function CodePage({ path, src }: {
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
  return (
    <>
      <style>{STYLE}</style>
      <body>
        <h3>
          <code>
            <a style="color:inherit" href="${escapeHtml(path)}">${path}</a>
          </code>
        </h3>
        <pre class="shiki"><code dangerouslySetInnerHTML={{__html: codeContent}} /></pre>
      </body>
    </>
  )
}
