import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http.ts"
import { PolkadotDevProvider, WssProvider, ZombienetProvider } from "./providers/frame/mod.ts"
import { handler } from "./server/local.ts"
import { Env } from "./server/mod.ts"
import { FsCache } from "./util/cache/mod.ts"

const { help, port, "--": cmd, out } = flags.parse(Deno.args, {
  boolean: ["help"],
  string: ["port", "out"],
  default: {
    port: "4646",
    out: "target/capi",
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

const controller = new AbortController()
const { signal } = controller

const href = `http://localhost:${port}`

const cache = new FsCache(out, signal)
const env = new Env(href, signal, cache, [
  (env) => new WssProvider(env),
  (env) => new PolkadotDevProvider(env),
  (env) => new ZombienetProvider(env),
])

cache.getString(
  "mod.ts",
  0,
  async () => `export * from ${JSON.stringify(import.meta.resolve("./mod.ts"))}`,
)

const alreadyRunning = await (async () => {
  try {
    if (await (await fetch(`${href}/capi_cwd`)).text() === Deno.cwd()) {
      return true
    }
  } catch (_e) {}
  return false
})()

if (!alreadyRunning) {
  await serve(handler(env), {
    port: +port,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening on ${href}`)
      await after()
    },
  })
} else await after()

async function after() {
  if (cmd.length) {
    const status = await Deno
      .run({
        cmd,
        stderr: "inherit",
        stdout: "inherit",
      })
      .status()
    // TODO: exit gracefully
    Deno.exit(status.code)
    // self.addEventListener("unload", () => Deno.exit(status.code))
    // controller.abort()
  }
}
