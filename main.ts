import { parseCommand } from "./cli/mod.ts"
import * as fs from "./deps/std/fs.ts"
import { serve } from "./deps/std/http/server.ts"
import * as path from "./deps/std/path.ts"
import { Env, PolkadotDevProvider, WssProvider, ZombienetProvider } from "./env/mod.ts"
import { handler } from "./server/mod.ts"
import { isReady } from "./util/port.ts"

const command = await parseCommand(Deno.args)

const env = new Env({
  dev: new PolkadotDevProvider(),
  zombienet: new ZombienetProvider(),
  wss: new WssProvider(),
})

switch (command.type) {
  case "serve": {
    const { port, user } = command
    serve(handler(env), {
      port,
      signal: env.signal,
      onError(error) {
        throw error
      },
      onListen() {
        console.log(`Capi server listening on http://localhost:${port}`)
      },
    })
    if (user) {
      await isReady(port)
      await Deno
        .run({
          cmd: user,
          stderr: "inherit",
          stdout: "inherit",
        })
        .status()
    }
    break
  }
  case "write": {
    const { pathInfo, out } = command
    const provider = env.providers[pathInfo.providerId]
    if (!provider) throw new Error()
    const target = provider.target(pathInfo)
    const codegen = await target.codegen()
    const pending: Promise<void>[] = []
    for (const [filePath, file] of codegen) {
      const dest = path.join(out, filePath)
      pending.push((async () => {
        await fs.ensureFile(dest)
        await Deno.writeTextFile(dest, file.code)
      })())
    }
    await Promise.all(pending)
  }
}

env.abortController.abort()
