import { Env, PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
import { connectionCodeWithUsers, createCustomChainSpec, handleCount } from "./common.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class ContractsDevProvider extends FrameBinProvider {
  userCount = { count: 0 }

  constructor(env: Env) {
    super(env, "substrate-contracts-node")
  }

  override async connectionCode(pathInfo: PathInfo, isTypes: boolean): Promise<string> {
    const url = new URL(fromPathInfo({ ...pathInfo, filePath: "user_i" }), this.env.href).toString()
    return connectionCodeWithUsers(await super.connectionCode(pathInfo, isTypes), isTypes, url)
  }

  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (pathInfo.filePath === "user_i") return handleCount(request, this.userCount)
    return super.handle(request, pathInfo)
  }

  async launch(pathInfo: PathInfo) {
    console.log("begin launch")
    const port = getAvailable()
    console.log("port", port)
    const chainSpec = await createCustomChainSpec(
      await this.getBinPath(pathInfo),
      "dev",
      42,
      this.env.signal,
    )
    console.log("chainSpec", chainSpec)
    await this.runBin(pathInfo, [
      "--tmp",
      "--alice",
      "--ws-port",
      port.toString(),
      "--chain",
      chainSpec,
    ])
    console.log("afterBin")
    return port
  }
}
