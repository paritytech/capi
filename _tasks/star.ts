import { parse } from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

const { ignore } = parse(Deno.args, { string: ["ignore"] })
let generated = ""
for await (
  const entry of fs.walk(".", {
    match: [/\.ts$/],
    skip: [/^target\//, ...ignore ? [new RegExp(ignore)] : []],
  })
) {
  generated += `import ${JSON.stringify(`../${entry.path}`)};\n`
}

const dir = path.join(Deno.cwd(), "target")
await fs.ensureDir(dir)
const dest = path.join(dir, "star.ts")
await Deno.writeTextFile(dest, generated)
