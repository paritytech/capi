import * as path from "../deps/std/path.ts"

export async function createTempDir() {
  const dir = path.resolve("target/devnets")
  await Deno.mkdir(dir, { recursive: true })
  return await Deno.makeTempDir({
    dir,
    prefix: `devnets-${new Date().toISOString()}-`,
  })
}
