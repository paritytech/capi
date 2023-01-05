import * as flags from "./deps/std/flags.ts"
import { serve } from "./server/local/serve.ts"

const { help, port: portRaw, "--": cacheCmdRest } = flags.parse(Deno.args, {
  string: ["port"],
  boolean: ["help"],
  "--": true,
  default: {
    port: "8000",
  },
  alias: {
    h: "help",
    p: "port",
  },
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

const abortController = new AbortController()

serve({
  port,
  signal: abortController.signal,
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
