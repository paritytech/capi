import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

let generated = ""
for await (
  const entry of fs.walk(".", {
    match: [/\.ts$/],
    skip: [/^target\//],
  })
) {
  generated += `import ${JSON.stringify(`../${entry.path}`)};\n`
}

const dest = path.join(Deno.cwd(), "target/star.ts")
console.log(`Writing "${dest}".`)
await Deno.writeTextFile(dest, generated)
