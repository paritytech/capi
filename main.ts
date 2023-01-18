import { File } from "./codegen/mod.ts"
import * as flags from "./deps/std/flags.ts"
import * as fs from "./deps/std/fs.ts"
import { serve } from "./deps/std/http/server.ts"
import * as path from "./deps/std/path.ts"
import {
  Env,
  parsePathInfo,
  PolkadotDevProvider,
  WssProvider,
  ZombienetProvider,
} from "./env/mod.ts"
import { handler } from "./server/mod.ts"
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

const port = serve_ === "" ? 8000 : typeof serve_ === "string" ? parseInt(serve_) : undefined
await (typeof port === "number" ? runServe : runWrite)()

async function runServe() {
  try {
    await Deno.connect({ port: port! })
    throw new Error(`Port ${port} already in use`)
  } catch (_e) {}
  if (src || out) throw new Error("Cannot simultaneously `serve` and write flags")
  const env = new Env({
    dev: new PolkadotDevProvider(),
    zombienet: new ZombienetProvider(),
    wss: new WssProvider(),
  })
  serve(handler(env), {
    port,
    signal: env.signal,
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
    env.abortController.abort()
  }
}

async function runWrite() {
  if (!(src && out)) throw new Error("Must specify `src`, `out` and `capi`")
  const env = new Env({
    dev: new PolkadotDevProvider(),
    zombienet: new ZombienetProvider(),
    wss: new WssProvider(),
  })
  const pathInfo = parsePathInfo(src)
  const provider = env.providers[pathInfo.providerId]
  if (!provider) throw new Error()
  const target = provider.target(pathInfo)
  const codegen = await target.codegen()
  const reexportFile = new File()
  reexportFile.codeRaw = `export * from "${capi}"\n`
  codegen.files.set("capi.ts", reexportFile)
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
  env.abortController.abort()
}
