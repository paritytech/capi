import * as shiki from "https://esm.sh/shiki@0.11.1?bundle&dev"
shiki.setCDN("https://unpkg.com/shiki/")
export const highlighter = await shiki.getHighlighter({ theme: "github-dark", langs: ["ts"] })
