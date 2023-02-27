import { parse } from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import { getOrInit } from "../util/state.ts"

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
const command = new Deno.Command(
  Deno.execPath(),
  {
    args: ["info", "-r=http://localhost:4646/", "--json", "target/star.ts"],
  },
)
const { stdout } = await command.output()
const data: Data = JSON.parse(new TextDecoder().decode(await stdout))

interface Data {
  redirects: Record<string, string>
  modules: Array<{
    specifier: string
    dependencies?: Array<{
      type?: {
        specifier: string
      }
      code?: {
        specifier: string
      }
    }>
  }>
}

const dependencies = new Map<string, Set<string>>()

function visit(specifier: string) {
  while (specifier in data.redirects) specifier = data.redirects[specifier]!
  if (specifier.startsWith("npm:") || specifier.startsWith("http")) return new Set<string>()
  return getOrInit(dependencies, specifier, () => {
    const module = data.modules.find((x) => x.specifier === specifier)
    if (!module) throw new Error("module not found " + specifier)
    const set = new Set<string>([specifier])
    dependencies.set(specifier, set)
    for (const dep of module.dependencies ?? []) {
      if (dep.code) {
        for (const s of visit(dep.code.specifier)) {
          set.add(s)
        }
      }
      if (dep.type) {
        for (const s of visit(dep.type.specifier)) {
          set.add(s)
        }
      }
    }
    return set
  })
}

for (const mod of data.modules) {
  visit(mod.specifier)
}

const entries = [...dependencies.entries()].sort((a, b) => b[1].size - a[1].size)

const done = new Set()
for (const [file, deps] of entries.slice(1)) {
  if (done.has(file)) continue
  console.log(file)
  const command = new Deno.Command(
    Deno.execPath(),
    {
      args: ["info", "-r=http://localhost:4646/", "--json", "target/star.ts"],
    },
  )
  const { code, success } = await command.output()
  if (!success) Deno.exit(code)
  for (const d of deps) {
    done.add(d)
  }
}

console.log("Checked successfully")
