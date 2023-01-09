import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http/server.ts"
import { handler, ServerCtx } from "./server/local/mod.ts"

const { help, port: portRaw, "--": cacheCmdRest } = flags.parse(Deno.args, {
  string: ["port", "cache"],
  boolean: ["help"],
  default: {
    port: "8000",
  },
  alias: {
    h: "help",
    p: "port",
  },
  "--": true,
})

if (help) {
  console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
  Deno.exit()
}

const port = parseInt(portRaw)
try {
  await Deno.connect({ port })
  console.error(`Port ${port} already in use`)
  Deno.exit(1)
} catch (_e) {}

const cacheDir = await Deno.makeTempDir({ prefix: "capi_server_" })
const abortController = new AbortController()
const { signal } = abortController
const ctx = new ServerCtx(cacheDir, signal)

serve(handler.bind(ctx), {
  port,
  signal,
  onListen() {
    console.log(`Capi server listening on http://localhost:${port}`)
  },
  onError(error) {
    console.log(`Internal server error`)
    console.log(error instanceof Error ? error.message : error)
    Deno.exit(1)
  },
})

if (cacheCmdRest.length) {
  await Deno
    .run({
      cmd: ["deno", "cache", `-r=http://localhost:${port}`, ...cacheCmdRest],
      stderr: "inherit",
      stdout: "inherit",
    })
    .status()
  abortController.abort()
}
