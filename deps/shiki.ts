import * as shiki from "https://esm.sh/v113/shiki@0.14.1?bundle"
import typescriptLang from "https://unpkg.com/shiki@0.14.2/languages/typescript.tmLanguage.json" assert {
  type: "json",
}
import githubDark from "https://unpkg.com/shiki@0.14.2/themes/github-dark.json" assert {
  type: "json",
}
import { shikiWasm } from "../util/_artifacts/shikiWasm.ts"

const isNode = "process" in globalThis

shiki.setWasm(shikiWasm)

// A gross hack to get the data url to work, since shiki requires the cdn to end with a slash
shiki.setCDN("data:application/")

export const highlighterPromise = shiki.getHighlighter({
  theme: isNode ? "github-dark" : githubDark as any,
  langs: [
    isNode ? "ts" : {
      id: "ts",
      scopeName: "source.ts",
      path: "json;base64," + btoa(JSON.stringify(typescriptLang)),
    },
  ],
})
