import { Env } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ProjectProvider extends FrameBinProvider {
  constructor(env: Env) {
    super(env, {
      bin: "cargo",
      installation: "https://www.rust-lang.org/tools/install",
    })
  }

  async launch() {
    const port = getAvailable()
    await this.runBin(["run", "--release", "--", "--dev", "--ws-port", port.toString()])
    return port
  }
}
