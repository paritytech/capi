import { createFromBuffer } from "../deps/dprint.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { tsFormatterWasmCompressed } from "./_artifacts/tsFormatterWasmCompressed.ts"
import { decompress } from "./compression.ts"

export const tsFormatterPromise = (async () => {
  const tsFormatterWasm = await decompress(tsFormatterWasmCompressed)
  const tsFormatter = createFromBuffer(tsFormatterWasm)
  const { indentWidth, lineWidth, typescript: config } = dprintConfig
  tsFormatter.setConfig({ indentWidth, lineWidth }, config)
  return tsFormatter
})()
