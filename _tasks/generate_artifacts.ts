import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { emptyDir } from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import dprintConfig from "../dprint.json" assert { type: "json" }
import { devUser } from "../mod.ts"
import { compress } from "../util/compression.ts"

export const DEV_USER_COUNT = 10_000

const artifacts: Record<string, () => Promise<Uint8Array>> = {
  async tsFormatterWasmCompressed() {
    const url = dprintConfig.plugins.find((v) =>
      v.startsWith("https://plugins.dprint.dev/typescript-")
    )!
    return await compress(await fetchBinary(url))
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
    const code = `hex.decode("${hex.encode(data)}")`

    const file = `
// This file was generated by \`_tasks/generate_artifacts.ts\`
import { hex } from "../../crypto/mod.ts"
export const ${name} = /* @__PURE__ */ ${code}
`.trimStart()
    await Deno.writeTextFile(path.join(artifactsDir, name + ".ts"), file)
  }),
)

async function fetchBinary(url: string | URL) {
  const data = await fetch(url).then((r) => r.arrayBuffer())
  return new Uint8Array(data)
}
