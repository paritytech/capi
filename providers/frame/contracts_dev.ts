import { File } from "../../codegen/frame/mod.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
import { chainFileWithUsers, createCustomChainSpec, handleCount } from "./common.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ContractsDevProvider extends FrameBinProvider {
  userCount = { count: 0 }

  constructor(env: Env) {
    super(env, {
      bin: "substrate-contracts-node",
      installation: "https://github.com/paritytech/substrate-contracts-node",
      readyTimeout: 60 * 1000,
    })
  }

  override async chainFile(pathInfo: PathInfo): Promise<File> {
    const url = new URL(fromPathInfo({ ...pathInfo, filePath: "user_i" }), this.env.href)
      .toString()
    return chainFileWithUsers(await super.chainFile(pathInfo), url)
  }

  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (pathInfo.filePath === "user_i") {
      return handleCount(request, this.userCount)
    }
    return super.handle(request, pathInfo)
  }

  async launch() {
    const port = getAvailable()
    const chainSpec = await createCustomChainSpec(this.bin, "dev", 42)
    await this.runBin(["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec])
    return port
  }
}
