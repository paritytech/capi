import { PermanentMemo } from "../../util/mod.ts"
import { getAvailable, ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export class ProjectProvider extends FrameProxyProvider {
  providerId = "project"

  urlMemo = new PermanentMemo<string, string>()
  dynamicUrl() {
    return this.urlMemo.run(Deno.cwd(), async () => {
      const port = getAvailable()
      const process = Deno.run({
        cmd: ["cargo", "run", "--release", "--", "--dev", "--ws-port", port.toString()],
        stdout: "piped",
        stderr: "piped",
      })
      this.env.signal.addEventListener("abort", () => {
        process.kill()
        process.close()
      })
      await ready(port)
      return `ws://localhost:${port}`
    })
  }
}
