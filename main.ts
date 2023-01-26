import { File } from "./codegen/mod.ts"
import * as flags from "./deps/std/flags.ts"
import * as fs from "./deps/std/fs.ts"
import { serve } from "./deps/std/http/server.ts"
import * as path from "./deps/std/path.ts"
import { PolkadotDevProvider, WssProvider, ZombienetProvider } from "./providers/frame/mod.ts"
import { handler } from "./server/local/mod.ts"
import { Env, parsePathInfo } from "./server/mod.ts"
import { isReady } from "./util/port.ts"

const { help, serve: serve_, src, out, capi, "--": cmd } = flags.parse(Deno.args, {
  string: ["serve", "src", "out", "capi"],
  default: {
    capi: "https://deno.land/x/capi/mod.ts",
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

const port = serve_ === "" ? 4646 : typeof serve_ === "string" ? parseInt(serve_) : undefined
await (typeof port === "number" ? runServe : runWrite)()

async function runServe() {
  try {
    await Deno.connect({ port: port! })
    throw new Error(`Port ${port} already in use`)
  } catch (_e) {}
  if (src || out) throw new Error("Cannot simultaneously `serve` and write flags")

  serve(handler(env), {
    port,
    signal,
    onError(error) {
      throw error
    },
    onListen() {
      console.log(`Capi server listening on http://localhost:${port}`)
    },
  })
  if (cmd.length) {
    await isReady(port!)
    await Deno
      .run({
        cmd,
        stderr: "inherit",
        stdout: "inherit",
      })
      .status()
    abortController.abort()
  }
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
  codegen.files["capi.ts"] = new File(`export * from "${capi}"`)
  const pending: Promise<void>[] = []
  await fs.emptyDir(out)
  for (const [filePath, file] of codegen) {
    const dest = path.join(out, filePath)
    console.log(`Writing "${dest}"`)
    pending.push((async () => {
      await fs.ensureFile(dest)
      await Deno.writeTextFile(dest, file.code(dest))
    })())
  }
  await Promise.all(pending)
  abortController.abort()
}
