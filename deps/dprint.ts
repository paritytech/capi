export * from "https://deno.land/x/dprint@0.2.0/mod.ts"
import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts"

export const tsFormatter = await createStreaming(
  // check https://plugins.dprint.dev/ for latest plugin versions
  fetch("https://plugins.dprint.dev/typescript-0.71.2.wasm"),
)

tsFormatter.setConfig({
  indentWidth: 2,
  lineWidth: 100,
}, {
  quoteProps: "asNeeded",
  "arrowFunction.useParentheses": "force",
  semiColons: "asi",
})
