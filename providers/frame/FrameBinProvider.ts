import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo, PromiseOr } from "../../util/mod.ts"
import { getAvailable, ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export interface FrameBinProviderProps {
  bin: string
  installation: string
  readyTimeout?: number // TODO
}

export abstract class FrameBinProvider<LaunchArg> extends FrameProxyProvider {
  bin
  installation
  timeout

  constructor(env: Env, { bin, installation, readyTimeout }: FrameBinProviderProps) {
    super(env)
    this.bin = bin
    this.installation = installation
    this.timeout = readyTimeout ?? 60 * 1000
  }

  abstract launchArg(pathInfo: PathInfo): LaunchArg

  abstract processKey(pathInfo: PathInfo): string

  port(_pathInfo: PathInfo): PromiseOr<number> {
    return getAvailable()
  }

  abstract args(launchInfo: LaunchArg): string[]

  launch(launchInfo: LaunchArg): Deno.Process {
    const cmd: string[] = [this.bin, ...this.args(launchInfo)]
    const process = Deno.run({
      cmd,
      stdout: "piped",
      stderr: "piped",
    })
    let closeProcess = () => {
      closeProcess = () => {}
      process.kill()
      process.close()
    }
    this.env.signal.addEventListener("abort", closeProcess)
    return process
  }

  dynamicUrlMemo = new PermanentMemo<string, string>()
  async dynamicUrl(pathInfo: PathInfo) {
    await this.assertBinValid()
    const key = this.processKey(pathInfo)
    return await this.dynamicUrlMemo.run(key, async () => {
      const port = await this.port(pathInfo)
      this.launch(this.launchArg(pathInfo))
      await ready(port)
      return `ws://localhost:${port}`
    })
  }

  binValid?: boolean
  async assertBinValid() {
    if (this.binValid === undefined) {
      const whichProcess = Deno.run({
        cmd: ["which", this.bin],
        stdout: "piped",
      })
      const binPathBytes = await whichProcess.output()
      whichProcess.close()
      if (!binPathBytes.length) {
        throw new Error(`No such bin "${this.bin}" in path. ${this.installation}`)
      }
      const { isFile, mode } = await Deno.lstat(new TextDecoder().decode(binPathBytes).trim())
      if (!(isFile && mode && mode & 0o111)) {
        throw new Error(`The bin "${this.bin}" is not executable.`)
      }
      this.binValid = true
    }
    return this.binValid
  }
}
