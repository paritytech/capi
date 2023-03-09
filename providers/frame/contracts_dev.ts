import { Env } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ContractsDevProvider extends FrameBinProvider {
  constructor(env: Env) {
    super(env, {
      bin: "substrate-contracts-node",
      installation: "https://github.com/paritytech/substrate-contracts-node",
      readyTimeout: 60 * 1000,
    })
  }

  async launch() {
    const port = getAvailable()
    const chainSpec = await this.createCustomChainSpec("dev", 42)
    await this.runBin(["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec])
    return port
  }
}
