import * as path from "../deps/std/path.ts"

export async function tempDir(parentDir: string, name: string) {
  const dir = path.join(parentDir, name, timeKey())
  await Deno.mkdir(dir, { recursive: true })
  return dir
}

function timeKey() {
  return new Date().toISOString().replace(/[:T.]/g, "-").slice(0, -1)
}
