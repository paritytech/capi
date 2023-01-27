export * from "https://deno.land/x/dprint@0.2.0/mod.ts"
import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }

const { indentWidth, lineWidth, typescript: config, plugins } = dprintConfig

// TODO: regularly check https://plugins.dprint.dev/ for latest plugin versions
export const tsFormatter = await createStreaming(
  fetch(plugins.find((v) => v.startsWith("https://plugins.dprint.dev/typescript-"))!),
)
tsFormatter.setConfig({ indentWidth, lineWidth }, config)
