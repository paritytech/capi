import { Env } from "../../server/mod.ts"
import { PathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ProjectProvider extends FrameBinProvider {
  constructor(env: Env) {
    super(env, "cargo")
  }

  override async getBinPath(): Promise<string> {
    return "cargo"
  }

  async launch(pathInfo: PathInfo) {
    const port = getAvailable()
    await this.runBin(pathInfo, ["run", "--release", "--", "--dev", "--ws-port", port.toString()])
    return port
  }
}
