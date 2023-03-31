import { download } from "../../deps/capi_binary_builds.ts"
import { deferred } from "../../deps/std/async.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

const readyTimeout = 3 * 60 * 1000

export abstract class FrameBinProvider extends FrameProxyProvider {
  constructor(env: Env, readonly bin: string) {
    super(env)
  }

  abstract launch(pathInfo: PathInfo): Promise<number>

  dynamicUrlMemo = new PermanentMemo<string, string>()
  async dynamicUrl(pathInfo: PathInfo) {
    return this.dynamicUrlMemo.run(pathInfo.target ?? "", () =>
      (() => {
        const d = deferred<never>()
        const t = setTimeout(
          () =>
            d.reject(
              new Error(
                `Timed out during codegen of the following path info: ${Deno.inspect(pathInfo)}`,
              ),
            ),
          readyTimeout,
        )
        return Promise.race([
          (async () => {
            const port = await this.launch(pathInfo)
            await ready(port)
            return `ws://localhost:${port}`
          })(),
          d,
        ]).finally(() => clearTimeout(t))
      })())
  }

  async getBinPath(pathInfo: PathInfo) {
    if (pathInfo.vRuntime === "local") return this.bin
    return download(this.bin, pathInfo.vRuntime!)
  }

  async runBin(pathInfo: PathInfo, args: string[]): Promise<Deno.ChildProcess> {
    const command = new Deno.Command(await this.getBinPath(pathInfo), {
      args,
      stdout: "piped",
      stderr: "piped",
      signal: this.env.signal,
    })

    return command.spawn()
  }
}
