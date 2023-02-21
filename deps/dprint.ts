export * from "https://deno.land/x/dprint@0.2.0/mod.ts"
import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { iterateReader } from "./std/streams.ts"

const { indentWidth, lineWidth, typescript: config } = dprintConfig

const file = await Deno.open("deps/dprint_plugin_ts.wasm", { read: true })
const body = new ReadableStream<Uint8Array>({
  start: async (controller) => {
    for await (const chunk of iterateReader(file)) {
      controller.enqueue(chunk.slice(0))
    }
    file.close()
    controller.close()
  },
  cancel() {
    file.close()
  },
})
const headers = new Headers()
headers.set("content-type", "application/wasm")
const response = new Response(body, { status: 200, headers })

export const tsFormatter = await createStreaming(Promise.resolve(response))

tsFormatter.setConfig({ indentWidth, lineWidth }, config)
