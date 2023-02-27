import { Env } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ContractsDevProvider extends FrameBinProvider {
  constructor(env: Env) {
    super(env, {
      bin: "substrate-contracts-node",
      installation: "https://github.com/paritytech/substrate-contracts-node",
      readyTimeout: 15 * 1000,
    })
  }

  dynamicUrlKey() {
    return ""
  }

  parseLaunchInfo() {
    return ""
  }

  async launch() {
    const port = getAvailable()
    await this.runBin(["--dev", "--ws-port", port.toString()])
    return port
  }
}
