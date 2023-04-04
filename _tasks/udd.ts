import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

const pending = [udd("_tasks/udd.ts")]

for await (
  const entry of fs.walk(".", {
    match: [
      path.globToRegExp("examples/**/*.ts"),
      path.globToRegExp("deps/**/*.ts"),
    ],
  })
) pending.push(udd(entry.path))

await Promise.all(pending)

async function udd(filePath: string) {
  await Deno
    .run({ cmd: ["deno", "run", "-A", "https://deno.land/x/udd@0.8.2/main.ts", filePath] })
    .status()
}
