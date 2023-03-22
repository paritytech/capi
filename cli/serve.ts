import * as flags from "../deps/std/flags.ts"
import { serve } from "../deps/std/http.ts"
import {
  ContractsDevProvider,
  PolkadotDevProvider,
  ProjectProvider,
  WssProvider,
  ZombienetProvider,
} from "../providers/frame/mod.ts"
import { handler } from "../server/handler.ts"
import { Env } from "../server/mod.ts"
import { FsCache } from "../util/cache/mod.ts"

export default async function(...args: string[]) {
  const { port: portStr, "--": cmd, out } = flags.parse(args, {
    string: ["port", "out"],
    default: {
      port: "4646",
      out: "target/capi",
    },
    "--": true,
  })

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
      hostname: "[::]",
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
    const [bin, ...args] = cmd
    if (bin) {
      const command = new Deno.Command(bin, { args, signal })
      const status = await command.spawn().status
      self.addEventListener("unload", () => Deno.exit(status.code))
      controller.abort()
    }
  }
}
