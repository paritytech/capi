import { deadline } from "../../deps/std/async.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export interface FrameBinProviderProps {
  bin: string
  installation: string
  readyTimeout?: number
}

export abstract class FrameBinProvider extends FrameProxyProvider {
  bin
  installation
  timeout

  constructor(env: Env, { bin, installation, readyTimeout }: FrameBinProviderProps) {
    super(env)
    this.bin = bin
    this.installation = installation
    this.timeout = readyTimeout ?? 60 * 1000
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
        this.timeout,
      ))
  }

  async runBin(args: string[]): Promise<Deno.ChildProcess> {
    await this.assertBinValid()
    const command = new Deno.Command(this.bin, {
      args,
      stdout: "piped",
      stderr: "piped",
      signal: this.env.signal,
    })

    return command.spawn()
  }

  binValid?: Promise<void>
  assertBinValid() {
    return this.binValid ??= (async () => {
      const whichProcess = new Deno.Command("which", {
        args: [this.bin],
        stdout: "piped",
        signal: this.env.signal,
      })
      const { stdout } = await whichProcess.output()
      if (!stdout.length) {
        throw new Error(
          `No such bin "${this.bin}" in path. Installation instructions can be found here: "${this.installation}"`,
        )
      }
    })()
  }
}
