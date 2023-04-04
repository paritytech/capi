import * as flags from "../deps/std/flags.ts"
import { serve } from "../deps/std/http.ts"
import * as path from "../deps/std/path.ts"
import { $api, createApi, serveScald, WsLink } from "../mod.ts"
import { handler } from "../server/handler.ts"
import { InMemoryCache } from "../util/cache/memory.ts"
import { FsCache } from "../util/cache/mod.ts"

export default async function(...args: string[]) {
  const { config: configFile, port: portStr, "--": cmd, out } = flags.parse(args, {
    string: ["port", "out", "config"],
    default: {
      config: "./capi.config.ts",
      port: "4646",
      out: "target/capi",
    },
    "--": true,
  })
  const configPath = path.resolve(configFile)
  await Deno.stat(configPath)
  const configModule = await import(path.toFileUrl(configPath).toString())
  const config = configModule.config
  if (typeof config !== "object") throw new Error("config file must have a config export")

  const href = `http://localhost:${portStr}/`

  const controller = new AbortController()
  const { signal } = controller

  const dataCache = new FsCache(out, signal)
  const tempCache = new InMemoryCache(signal)

  const running = await fetch(`${href}capi_cwd`)
    .then((r) => r.text())
    .then((r) => r === Deno.cwd())
    .catch(() => false)

  if (!running) {
    const h = handler(dataCache, tempCache)
    const api = createApi(config, signal)
    await serve((request, connInfo) => {
      if (new URL(request.url).pathname === "/api") {
        const { response, socket } = Deno.upgradeWebSocket(request)
        serveScald($api, api, new WsLink(socket, signal), signal)
        return response
      }
      return h(request, connInfo)
    }, {
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
