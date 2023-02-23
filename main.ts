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

const { help, dbg, port, "--": cmd, out } = flags.parse(Deno.args, {
  boolean: ["help", "dbg"],
  string: ["port", "out"],
  default: {
    dbg: false,
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

const controller = new AbortController()
const { signal } = controller

const cache = new FsCache(out, signal)
const env = new Env({
  signal,
  cache,
  dbg,
  providerGroups: {
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
      contracts(env) {
        return new ContractsDevProvider(env)
      },
    },
  },
})

const capiModPath = JSON.stringify(import.meta.resolve("./mod.ts"))
cache.getString("mod.ts", 0, async () => `export * from ${capiModPath}`)

let running = false
const href = `http://localhost:${port}`
try {
  if (await (await fetch(`${href}/capi_cwd`)).text() === Deno.cwd()) running = true
} catch (_e) {}

if (!running) {
  await serve(handler(env), {
    port: +port,
    signal,
    onError(error) {
      throw error
    },
    async onListen() {
      console.log(`Capi server listening ("${href}")`)
      await after()
    },
  })
} else {
  console.log(`Reusing existing Capi server ("${href}")`)
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
