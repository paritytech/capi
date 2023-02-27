import { deferred } from "../../deps/std/async.ts"
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

  abstract dynamicUrlKey(pathInfo: PathInfo): string

  abstract launch(pathInfo: PathInfo): Promise<number>

  dynamicUrlMemo = new PermanentMemo<string, string>()
  async dynamicUrl(pathInfo: PathInfo) {
    const dynamicUrlKey = this.dynamicUrlKey(pathInfo)
    return this.dynamicUrlMemo.run(dynamicUrlKey, async () => {
      const urlPending = (async () => {
        const port = await this.launch(pathInfo)
        await ready(port)
        return `ws://localhost:${port}`
      })()
      const url = await (this.timeout
        ? (() => {
          const timeoutPending = deferred<typeof timeout>()
          const timerId = setTimeout(() => timeoutPending.resolve(timeout), this.timeout)
          return Promise.race([
            timeoutPending,
            urlPending.then((e) => {
              clearTimeout(timerId)
              return e
            }),
          ])
        })()
        : urlPending)
      if (url === timeout) throw new Error("timeout")
      return url
    })
  }

  async initBinRun(args: string[]): Promise<Deno.Process> {
    await this.assertBinValid()
    const process = Deno.run({
      cmd: [this.bin, ...args],
      stdout: "piped",
      stderr: "piped",
    })
    this.env.signal.addEventListener("abort", async () => {
      process.kill("SIGINT")
      process.stdout.close()
      process.stderr.close()
      process.close()
    })
    return process
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
        throw new Error(
          `No such bin "${this.bin}" in path. Installation instructions can be found here: "${this.installation}"`,
        )
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

const timeout = Symbol()
