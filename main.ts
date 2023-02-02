import * as flags from "./deps/std/flags.ts"
import * as fs from "./deps/std/fs.ts"
import { serve } from "./deps/std/http/server.ts"
import * as path from "./deps/std/path.ts"
import { PolkadotDevProvider, WssProvider, ZombienetProvider } from "./providers/frame/mod.ts"
import { handler } from "./server/local/mod.ts"
import { Env } from "./server/mod.ts"

const { help, serve: serve_, src, dest, capi, "--": cmd } = flags.parse(Deno.args, {
  boolean: ["help"],
  string: ["src", "dest", "capi", "serve"],
  default: {
    dest: "target/capi",
    capi: import.meta.resolve("./mod.ts"),
  },
  alias: {
    h: "help",
  },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

if (typeof serve_ === "string" && src) {
  throw new Error(`Cannot specify both \`--serve\` and \`--src\``)
}

const controller = new AbortController()
const { signal } = controller

const env = new Env(signal, [
  (env) => new WssProvider(env),
  (env) => new PolkadotDevProvider(env),
  (env) => new ZombienetProvider(env),
])

if (src) {
  const { providerId, generatorId, cacheKey, codegen } = await env.digest(src)
  const codegenDest = path.join(dest, generatorId, providerId, cacheKey)
  try {
    await Deno.remove(codegenDest, { recursive: true })
  } catch (_e) {}
  const depPath = path.join(codegenDest, "capi.ts")
  const capi_ = capi.startsWith("file:///")
    ? capi
    : path.relative(path.join("..", depPath), path.join(Deno.cwd(), capi))
  await Promise.all([
    (async () => {
      await fs.ensureFile(depPath)
      await Deno.writeTextFile(depPath, `export * from "${capi_}"`)
    })(),
    [...codegen.files.entries()].map(async ([subpath, file]) => {
      const dest_ = path.join(codegenDest, subpath)
      await fs.ensureFile(dest_)
      return await Deno.writeTextFile(dest_, file.code(dest_))
    }),
  ])
  controller.abort()
}

if (typeof serve_ === "string") {
  const port = +(serve_ || 4646)
  const href = `http://localhost:${port}`

  let portErr: string | undefined
  try {
    if (await (await fetch(`${href}/capi_cwd`)).text() === Deno.cwd()) {
      portErr = `Capi server already running on port ${port}`
    }
    portErr = `Port ${port} is already in use`
  } catch (_e) {}
  if (portErr) throw new Error(portErr)

  await serve(handler(env), {
    port,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening on ${href}`)
      if (cmd.length) {
        const status = await Deno
          .run({
            cmd,
            stderr: "inherit",
            stdout: "inherit",
          })
          .status()
        self.addEventListener("unload", () => Deno.exit(status.code))
        controller.abort()
      }
    },
  })
}
