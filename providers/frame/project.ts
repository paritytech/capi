import * as path from "../../deps/std/path.ts"
import { PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { getAvailable, isReady } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export class ProjectProvider extends FrameProxyProvider {
  providerId = "project"

  urlMemo = new PermanentMemo<string, string>()
  dynamicUrl(pathInfo: PathInfo) {
    const { target } = pathInfo
    const workspacePath = target.startsWith("~/")
      ? path.join(Deno.env.get("HOME")!, target.slice(2))
      : target === "$cwd"
      ? Deno.cwd()
      : target
    return this.urlMemo.run(workspacePath, async () => {
      const port = await this.cargoRun(workspacePath)
      return `ws://localhost:${port}`
    })
  }

  async cargoRun(workspacePath: string) {
    const port = getAvailable()
    const process = Deno.run({
      cmd: ["cargo", "run", "--release", "--", "--dev", "--ws-port", port.toString()],
      stdout: "piped",
      stderr: "piped",
      cwd: workspacePath,
    })
    this.env.signal.addEventListener("abort", () => {
      process.kill()
      process.close()
    })
    await isReady(port)
    return port
  }
}
