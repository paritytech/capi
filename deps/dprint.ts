export * from "https://deno.land/x/dprint@0.2.0/mod.ts"
import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { readableStreamFromReader } from "./std/streams.ts"

export const tsFormatter = await createStreaming(Promise.resolve(
  new Response(
    readableStreamFromReader(await Deno.open("deps/dprint_ts.wasm", { read: true })),
    { headers: { "Content-Type": "application/wasm" } },
  ),
))
const { indentWidth, lineWidth, typescript: config } = dprintConfig
tsFormatter.setConfig({ indentWidth, lineWidth }, config)
