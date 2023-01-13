import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http/server.ts"
import { fsHost, handler, memoryHost, responseFactories } from "./env/local/mod.ts"
import {
  parsePathInfo,
  PolkadotDevProvider,
  ProviderBase,
  WssProvider,
  ZombienetProvider,
} from "./env/mod.ts"
import { isReady } from "./util/port.ts"

const { help, serve: serve_, src, out, "--": cmd } = flags.parse(Deno.args, {
  string: ["serve", "src", "out"],
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

const host = (port ? memoryHost : fsHost)()
const dev = new PolkadotDevProvider(host)
const zombienet = new ZombienetProvider(host)
const wss = new WssProvider(host)
const providers: Record<string, ProviderBase> = { dev, zombienet, wss }

if (port) {
  try {
    await Deno.connect({ port })
    throw new Error(`Port ${port} already in use`)
  } catch (_e) {}
  if (src || out) throw new Error()
  serve(handler(responseFactories, providers), {
    port,
    signal: host.abortController.signal,
    onListen() {
      console.log(`Capi server listening on http://localhost:${port}`)
    },
    onError(error) {
      throw error
    },
  })
  if (cmd.length) {
    await isReady(port)
    await Deno
      .run({
        cmd,
        stderr: "inherit",
        stdout: "inherit",
      })
      .status()
    host.abortController.abort()
  }
}

if (src && out) {
  const pathInfo = parsePathInfo(src)
  const provider = providers[pathInfo.providerId]
  if (!provider) throw new Error()
  const target = provider.target(pathInfo)
  const codegen = await target.codegen()
  codegen.write(out)
}
