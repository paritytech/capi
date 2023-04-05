import * as path from "../deps/std/path.ts"

export async function createTempDir() {
  const dir = path.resolve("target/capn")
  await Deno.mkdir(dir, { recursive: true })
  return await Deno.makeTempDir({
    dir,
    prefix: `capn-${new Date().toISOString()}-`,
  })
}
