import * as flags from "../deps/std/flags.ts"
import { blue, gray, yellow } from "../deps/std/fmt/colors.ts"
import { serve } from "../deps/std/http.ts"
import { createTempDir } from "../devnets/createTempDir.ts"
import { createDevnetsHandler } from "../devnets/mod.ts"
import { createCorsHandler } from "../server/corsHandler.ts"
import { createErrorHandler } from "../server/errorHandler.ts"
import { createCodegenHandler } from "../server/mod.ts"
import { InMemoryCache } from "../util/cache/memory.ts"
import { FsCache } from "../util/cache/mod.ts"
import { gracefulExit } from "../util/mod.ts"
import { resolveConfig } from "./resolveConfig.ts"

export default async function(...args: string[]) {
  const { port, "--": cmd, out } = flags.parse(args, {
    string: ["port", "out"],
    default: {
      port: "4646",
      out: "target/capi",
    },
    "--": true,
  })

  const config = await resolveConfig(...args)

  const tempDir = await createTempDir()

  const href = `http://localhost:${port}/`

  const controller = new AbortController()
  const { signal } = controller

  const dataCache = new FsCache(out, signal)
  const tempCache = new InMemoryCache(signal)

  const running = await fetch(`${href}capi_cwd`)
    .then((r) => r.text())
    .then((r) => r === Deno.cwd())
    .catch(() => false)

  if (!running) {
    const devnetsHandler = createDevnetsHandler(tempDir, config, signal)
    const codegenHandler = createCodegenHandler(dataCache, tempCache)
    const handler = createCorsHandler(createErrorHandler(async (request) => {
      const { pathname } = new URL(request.url)
      if (pathname === "/capi_cwd") {
        return new Response(Deno.cwd())
      }
      if (pathname.startsWith("/devnets/")) {
        return await devnetsHandler(request)
      }
      return await codegenHandler(request)
    }))
    await serve(handler, {
      hostname: "::",
      port: +port,
      signal,
      onError(error) {
        throw error
      },
      async onListen() {
        console.log(blue("Created"), "Capi server instance", gray(`at ${href}`))
        await onReady()
      },
    })
  } else {
    console.log(yellow("Reusing"), "Capi server instance", gray(`at ${href}`))
    await onReady()
  }

  async function onReady() {
    const [bin, ...args] = cmd
    if (bin) {
      const command = new Deno.Command(bin, {
        args,
        signal,
        env: {
          DEVNETS_SERVER: `http://localhost:${port}/devnets/`,
        },
      })
      const status = await command.spawn().status
      gracefulExit(status.code)
      controller.abort()
    }
  }
}
