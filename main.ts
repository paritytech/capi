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

const { help, port: portRaw, "--": cmd, out } = flags.parse(Deno.args, {
  boolean: ["help"],
  string: ["port", "out"],
  default: {
    port: 4646,
    out: "target/capi",
  },
  alias: { h: "help" },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

const href = `http://localhost:${portRaw}/`

const controller = new AbortController()
const { signal } = controller

const cache = new FsCache(out, signal)
const modPath = JSON.stringify(import.meta.resolve("./mod.ts"))
cache.getString("mod.ts", 0, async () => `export * from ${modPath}`)

const env = new Env(href, cache, signal, {
  frame: {
    wss(env) {
      return new WssProvider(env)
    },
    dev(env) {
      return new PolkadotDevProvider(env)
    },
    zombienet(env) {
      return new ZombienetProvider(env)
    },
    project(env) {
      return new ProjectProvider(env)
    },
    contracts_dev(env) {
      return new ContractsDevProvider(env)
    },
  },
})

let running = false
try {
  if (await (await fetch(`${href}/capi_cwd`)).text() === Deno.cwd()) running = true
} catch (_e) {}

if (!running) {
  await serve(handler(env), {
    port: +portRaw,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening at "${href}"`)
      await after()
    },
  })
} else {
  console.log(`Reusing existing Capi server at "${href}"`)
  await after()
}

async function after() {
  if (cmd.length) {
    const process = Deno.run({ cmd })
    const status = await process.status()
    self.addEventListener("unload", () => Deno.exit(status.code))
    process.close()
    controller.abort()
  }
}
