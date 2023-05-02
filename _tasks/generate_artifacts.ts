import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { emptyDir } from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { devUser } from "../nets/mod.ts"
import { compress } from "../util/mod.ts"

export const DEV_USER_COUNT = 100_000

const artifacts: Record<string, () => Promise<Uint8Array>> = {
  async tsFormatterWasm() {
    const url = dprintConfig.plugins.find((v) =>
      v.startsWith("https://plugins.dprint.dev/typescript-")
    )!
    return await fetchBinary(url)
  },
  async shikiWasm() {
    return await fetchBinary("https://unpkg.com/shiki@0.14.1/dist/onig.wasm")
  },
  async devUserPublicKeysData() {
    const publicKeys = []
    for (let i = 0; i < DEV_USER_COUNT; i++) {
      publicKeys.push(devUser(i).publicKey)
    }
    const encoded = $.array($.sizedUint8Array(32)).encode(publicKeys)
    return encoded
  },
}

const artifactsDir = "util/_artifacts/"

await emptyDir(artifactsDir)

await Promise.all(
  Object.entries(artifacts).map(async ([name, fn]) => {
    const data = await fn()
    let code
    const compressed = await compress(data)
    if (compressed.length < data.length) {
      code = `await decompress(hex.decode("${hex.encode(compressed)}"))`
    } else {
      code = `hex.decode("${hex.encode(data)}")`
    }

    const file = `
// This file was generated by \`_tasks/generate_artifacts.ts\`
import { hex } from "../../crypto/mod.ts"
import { decompress } from "../compression.ts"
export const ${name} = ${code}
`.trimStart()
    await Deno.writeTextFile(path.join(artifactsDir, name + ".ts"), file)
  }),
)

async function fetchBinary(url: string | URL) {
  const data = await fetch(url).then((r) => r.arrayBuffer())
  return new Uint8Array(data)
}
