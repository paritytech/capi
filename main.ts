import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http/server.ts"
import { PolkadotDevProvider, WssProvider, ZombienetProvider } from "./providers/frame/mod.ts"
import { handler } from "./server/local/mod.ts"
import { Env } from "./server/mod.ts"

const { help, port: portRaw, out, capi, "--": cmd } = flags.parse(Deno.args, {
  boolean: ["help"],
  string: ["port", "out", "capi"],
  default: {
    port: "4646",
    capi: import.meta.resolve("./mod.ts"),
  },
  alias: {
    h: "help",
    p: "port",
    o: "out",
    c: "capi",
  },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

const port = +portRaw
const href = `http://localhost:${port}`

let portErr: string | undefined
try {
  if (await (await fetch(`${href}/capi_cwd`)).text() === Deno.cwd()) {
    portErr = `Capi server already running on port ${port}`
  }
  portErr = `Port ${port} is already in use`
} catch (_e) {}
if (portErr) throw new Error(portErr)

const controller = new AbortController()
const { signal } = controller

const env = new Env(signal, [
  (env) => new WssProvider(env),
  (env) => new PolkadotDevProvider(env),
  (env) => new ZombienetProvider(env),
])

out && signal.addEventListener("abort", () => env.writeDir(out))

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

// async function runWrite() {
//   if (!(src && out)) throw new Error("Must specify `src`, `out` and `capi`")
//   const codegen = await env.codegen(src)
//   codegen.files.set("capi.ts", new File(`export * from "${capi}"`))
//   await fs.emptyDir(out)
//   await Promise.all([...codegen.files.entries()].map(async ([filePath, file]) => {
//     const dest = path.join(out, filePath)
//     console.log(`Writing "${dest}"`)
//     await fs.ensureFile(dest)
//     await Deno.writeTextFile(dest, file.code(dest))
//   }))
//   controller.abort()
// }
