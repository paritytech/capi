import * as flags from "./deps/std/flags.ts"
import { serve } from "./server/mod.ts"

const { cache, help, port: portRaw } = flags.parse(Deno.args, {
  string: ["port", "cache"],
  alias: {
    p: "port",
    c: "cache",
    h: "help",
  },
  boolean: ["help"],
  default: {
    cache: false,
    port: "8000",
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

if (cache) {
  await Deno
    .run({
      cmd: ["deno", "cache", `-r=http://localhost:${port}`, ...Deno.args],
      stderr: "inherit",
      stdout: "inherit",
    })
    .status()
  abortController.abort()
}
