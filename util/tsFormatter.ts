import { createFromBuffer } from "../deps/dprint.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { tsFormatterWasm } from "./_artifacts/tsFormatterWasm.ts"

export const tsFormatter = createFromBuffer(tsFormatterWasm)
const { indentWidth, lineWidth, typescript: config } = dprintConfig
tsFormatter.setConfig({ indentWidth, lineWidth }, config)
