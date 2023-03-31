import { download } from "../../deps/capi_binary_builds.ts"
import { deadline } from "../../deps/std/async.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

const readyTimeout = 15 * 60 * 1000

export abstract class FrameBinProvider extends FrameProxyProvider {
  constructor(env: Env, readonly bin: string) {
    super(env)
  }

  abstract launch(pathInfo: PathInfo): Promise<number>

  dynamicUrlMemo = new PermanentMemo<string, string>()
  async dynamicUrl(pathInfo: PathInfo) {
    return this.dynamicUrlMemo.run(pathInfo.target ?? "", () =>
      deadline(
        (async () => {
          const port = await this.launch(pathInfo)
          await ready(port)
          return `ws://localhost:${port}`
        })(),
        readyTimeout,
      ))
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
    const child = command.spawn()
    // TODO: get rid of this without breaking CI
    this.env.signal.addEventListener("abort", () => child.kill("SIGKILL"))
    return child
  }
}
