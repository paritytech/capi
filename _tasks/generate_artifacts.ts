import { hex } from "../crypto/mod.ts"
import { testUser } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { DEFAULT_TEST_USER_COUNT, publicKeysUrl } from "../providers/frame/common.ts"

const GENERATION_NOTICE = `// This file was generated by \`_tasks/downloads.ts\``

const response = await fetch(
  dprintConfig.plugins.find((v) => v.startsWith("https://plugins.dprint.dev/typescript-"))!,
)
const wasm = new TextDecoder().decode(hex.encodeBuf(new Uint8Array(await response.arrayBuffer())))
const tsFormatterPath = new URL("../util/tsFormatter.ts", import.meta.url)
await Deno.writeTextFile(
  tsFormatterPath,
  `${GENERATION_NOTICE}
import { createFromBuffer } from "../deps/dprint.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { hex } from "../crypto/mod.ts"

const wasm = "${wasm}"

export const tsFormatter = createFromBuffer(hex.decode(wasm))
const { indentWidth, lineWidth, typescript: config } = dprintConfig
tsFormatter.setConfig({ indentWidth, lineWidth }, config)
`,
)

const publicKeys = []
for (let i = 0; i < DEFAULT_TEST_USER_COUNT; i++) {
  publicKeys.push(testUser(i).publicKey)
}
await Deno.writeFile(
  path.fromFileUrl(publicKeysUrl),
  $.array($.sizedUint8Array(32)).encode(publicKeys),
)