import { Command } from "../deps/cliffy.ts"
import { blue, gray, yellow } from "../deps/std/fmt/colors.ts"
import { serve as httpServe } from "../deps/std/http.ts"
import {
  createCodegenHandler,
  createCorsHandler,
  createDevnetsHandler,
  createErrorHandler,
} from "../server/mod.ts"
import { FsCache, InMemoryCache } from "../util/cache/mod.ts"
import { gracefulExit } from "../util/mod.ts"
import { tempDir } from "../util/tempDir.ts"
import { resolveNets } from "./resolveNets.ts"

export const serve = new Command()
  .description("Starts CAPI server")
  .option("-n, --nets <nets:file>", "nets.ts file path", { default: "./nets.ts" })
  .option("-p, --port <port:number>", "", { default: 4646 })
  .option(
    "-o, --out <out:string>",
    "Directory at which disk-related operations (such as storing devnet logs and caching metadata) can occur",
    {
      default: "target/capi",
    },
  )
  .option("--target <target:string>", "target name in net.ts")
  .action(async function({ nets: netsPath, port, out, target }) {
    const literalArgs = this.getLiteralArgs()
    const nets = await resolveNets(netsPath)
    const devnetTempDir = await tempDir(out, "devnet")
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
      const devnetsHandler = createDevnetsHandler(devnetTempDir, nets, signal)
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
      await httpServe(handler, {
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
      const [bin, ...args] = literalArgs
      if (bin) {
        const command = new Deno.Command(bin, {
          args,
          signal,
          env: {
            CAPI_SERVER: href,
            ...target ? { CAPI_TARGET: target } : {},
          },
        })
        const status = await command.spawn().status
        gracefulExit(status.code)
        controller.abort()
      }
    }
  })
