import { PromiseOr } from "../../util/mod.ts"
import { ServerCtxBase } from "../CtxBase.ts"

export abstract class Provider<PathInfo> {
  declare ctx: ServerCtxBase

  abstract tryParsePathInfo(path: string): TryParsePathInfoResult<PathInfo>
  abstract code(pathInfo: PathInfo): PromiseOr<string>

  async run(req: Request, path: string) {
    const pathInfo = this.tryParsePathInfo(path)
    if (pathInfo.error) {
      return await this.ctx[500](req, pathInfo.error)
    }
    await this.code(pathInfo as PathInfo)
    return new Response("TODO")
  }
}

export type TryParsePathInfoResult<PathInfo> =
  | { [K in keyof PathInfo]+?: never } & { error: string }
  | PathInfo & { error?: never }
