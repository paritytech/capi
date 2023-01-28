import { File } from "./codegen/mod.ts"
import * as flags from "./deps/std/flags.ts"
import * as fs from "./deps/std/fs.ts"
import { serve } from "./deps/std/http/server.ts"
import * as path from "./deps/std/path.ts"
import { PolkadotDevProvider, WssProvider, ZombienetProvider } from "./providers/frame/mod.ts"
import { handler } from "./server/local/mod.ts"
import { Env, parsePathInfo } from "./server/mod.ts"

const { help, serve: serve_, src, out, capi, "--": cmd } = flags.parse(Deno.args, {
  string: ["serve", "src", "out", "capi"],
  default: {
    capi: import.meta.resolve("./mod.ts"),
  },
  boolean: ["help"],
  alias: {
    h: "help",
  },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

const abortController = new AbortController()
const { signal } = abortController
const env = new Env(signal, [
  (env) => new WssProvider(env),
  (env) => new PolkadotDevProvider(env),
  (env) => new ZombienetProvider(env),
])

if (typeof serve_ === "string") {
  runServe(+(serve_ || 4646))
} else {
  runWrite()
}

function runServe(port: number) {
  if (src || out) throw new Error("Cannot simultaneously specify serve and write args")

  serve(handler(env), {
    port,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening on http://localhost:${port}`)
      if (cmd.length) {
        const status = await Deno
          .run({
            cmd,
            stderr: "inherit",
            stdout: "inherit",
          })
          .status()
        abortController.abort()
        self.addEventListener("unload", () => Deno.exit(status.code))
      }
    },
  })
}

async function runWrite() {
  if (!(src && out)) throw new Error("Must specify `src`, `out` and `capi`")
  const pathInfo = parsePathInfo(src)
  if (!pathInfo) throw new Error("Could not parse src")
  const { generatorId, providerId } = pathInfo
  const generatorProviders = env.providers[generatorId]
  if (!generatorProviders) {
    throw new Error(`Could not match provider with generatorId of \`${generatorId}\``)
  }
  const provider = generatorProviders[providerId]
  if (!provider) {
    throw new Error(`Could not match ${generatorId} provider with providerId of \`${providerId}\``)
  }
  const codegen = await provider.codegen(pathInfo)
  codegen.files.set("capi.ts", new File(`export * from "${capi}"`))
  await fs.emptyDir(out)
  await Promise.all([...codegen.files.entries()].map(async ([filePath, file]) => {
    const dest = path.join(out, filePath)
    console.log(`Writing "${dest}"`)
    await fs.ensureFile(dest)
    await Deno.writeTextFile(dest, file.code(dest))
  }))
  abortController.abort()
}
