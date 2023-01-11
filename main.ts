import * as flags from "./deps/std/flags.ts"
import { serve } from "./deps/std/http/server.ts"
import { handler, ServerCtx } from "./server/local/mod.ts"
import { isReady } from "./util/port.ts"

const { help, port: portRaw, "--": cmd } = flags.parse(Deno.args, {
  string: ["port"],
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
    console.log(error)
    Deno.exit(1)
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
  abortController.abort()
}
