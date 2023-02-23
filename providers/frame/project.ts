import { Env } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ProjectProvider extends FrameBinProvider<string> {
  constructor(env: Env) {
    super(env, {
      bin: "cargo",
      installation: "https://www.rust-lang.org/tools/install",
    })
  }

  dynamicUrlKey() {
    return Deno.cwd()
  }

  parseLaunchInfo() {
    return Deno.cwd()
  }

  async launch() {
    const port = getAvailable()
    await this.initBinRun(["run", "--release", "--", "--dev", "--ws-port", port.toString()])
    return port
  }
}
