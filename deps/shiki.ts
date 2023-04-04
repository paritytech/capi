import * as shiki from "https://esm.sh/shiki@0.14.1?bundle"
import typescriptLang from "https://unpkg.com/shiki@0.14.1/languages/typescript.tmLanguage.json" assert {
  type: "json",
}
import githubDark from "https://unpkg.com/shiki@0.14.1/themes/github-dark.json" assert {
  type: "json",
}
import { shikiWasm } from "../util/_artifacts/shikiWasm.ts"

shiki.setWasm(shikiWasm)

// A gross hack to get the data url to work, since shiki requires the cdn to end with a slash
shiki.setCDN("data:application/")

export const highlighterPromise = shiki.getHighlighter({
  theme: githubDark as any,
  langs: [{
    id: "ts",
    scopeName: "source.ts",
    path: "json;base64," + btoa(JSON.stringify(typescriptLang)),
  }],
})