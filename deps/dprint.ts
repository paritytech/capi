export * from "https://deno.land/x/dprint@0.2.0/mod.ts"
import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { readableStreamFromReader } from "./std/streams.ts"

const file = await Deno.open("deps/dprint_ts.wasm", { read: true })
const body = readableStreamFromReader(file)
const headers = new Headers()
headers.set("content-type", "application/wasm")
const response = new Response(body, { status: 200, headers })
export const tsFormatter = await createStreaming(Promise.resolve(response))

const { indentWidth, lineWidth, typescript: config } = dprintConfig
tsFormatter.setConfig({ indentWidth, lineWidth }, config)
