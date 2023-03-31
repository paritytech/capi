import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

let generated = ""
for await (
  const entry of fs.walk(".", {
    match: [/\.ts$/],
    skip: [/^target\//, path.globToRegExp("examples/ink/*.ts")],
  })
) {
  generated += `import ${JSON.stringify(`../${entry.path}`)};\n`
}

const dir = path.join(Deno.cwd(), "target")
await fs.ensureDir(dir)
const dest = path.join(dir, "star.ts")
await Deno.writeTextFile(dest, generated)
