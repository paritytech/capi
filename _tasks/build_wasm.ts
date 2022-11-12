import * as path from "../deps/std/path.ts"
import * as hex from "../util/hex.ts"

const wasmPaths = [
  "hashers/xxhash",
  "hashers/blake2b",
]

await Promise.all(wasmPaths.map(build))

async function build(wasmPath: string) {
  const process = Deno.run({
    cmd: ["wat2wasm", wasmPath + ".wat", "--output=-"],
    stdout: "piped",
    stderr: "inherit",
    stdin: "null",
  })

  if (!(await process.status()).success) {
    throw new Error(wasmPath + ".wat build failed")
  }

  const wasm = await process.output()

  await Deno.writeTextFile(
    wasmPath + ".wasm.ts",
    `
// @generated

import { Hex, hex } from "${path.relative(path.dirname(wasmPath), "util/mod.ts")}";

export default hex.decode(\n"${hex.encode(wasm).replace(/.{0,64}|$/g, "\\\n$&")}" as Hex,\n);
`.trimStart(),
  )
}
