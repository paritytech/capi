import * as path from "../deps/std/path.ts"

export async function createTempDir() {
  const dir = path.resolve(`target/devnets/devnet-${new Date().toISOString()}`)
  await Deno.mkdir(dir, { recursive: true })
  return dir
}
