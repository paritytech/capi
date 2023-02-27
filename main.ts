import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http.ts"
import {
  ContractsDevProvider,
  PolkadotDevProvider,
  ProjectProvider,
  WssProvider,
  ZombienetProvider,
} from "./providers/frame/mod.ts"
import { handler } from "./server/local.ts"
import { Env } from "./server/mod.ts"
import { FsCache } from "./util/cache/mod.ts"

const { help, port: portStr, "--": cmd, out } = flags.parse(Deno.args, {
  boolean: ["help"],
  string: ["port", "out"],
  default: {
    port: "4646",
    out: "target/capi",
  },
  alias: { h: "help" },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

const href = `http://localhost:${portStr}/`

const controller = new AbortController()
const { signal } = controller

const cache = new FsCache(out, signal)
const modSpecifier = JSON.stringify(import.meta.resolve("./mod.ts"))
cache.getString("mod.ts", 0, async () => `export * from ${modSpecifier}`)

const env = new Env(href, cache, signal, (env) => ({
  frame: {
    wss: new WssProvider(env),
    dev: new PolkadotDevProvider(env),
    zombienet: new ZombienetProvider(env),
    project: new ProjectProvider(env),
    contracts_dev: new ContractsDevProvider(env),
  },
}))

const running = await fetch(`${href}capi_cwd`)
  .then((r) => r.text())
  .then((r) => r === Deno.cwd())
  .catch(() => false)

if (!running) {
  await serve(handler(env), {
    port: +portStr,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening at "${href}"`)
      await onReady()
    },
  })
} else {
  console.log(`Reusing existing Capi server at "${href}"`)
  await onReady()
}

async function onReady() {
  if (cmd.length) {
    const [commandPath, ...args] = cmd
    const command = new Deno.Command(commandPath!, { args })
    const process = command.spawn()
    process.unref()
    const status = await process.status
    self.addEventListener("unload", () => Deno.exit(status.code))
    controller.abort()
  }
}
