import { Client } from "../../rpc/mod.ts"
import { Ctx } from "../Ctx.ts"

export abstract class Provider<PathInfo> {
  declare ctx: Ctx
  abstract providerMatches: Record<string, boolean>
  abstract tryParsePathInfo(path: string): TryParsePathInfoResult<PathInfo>
  abstract client(pathInfo: PathInfo): Promise<Client>
}

export type TryParsePathInfoResult<PathInfo> =
  | (
    & { [K in keyof PathInfo]+?: never }
    & { error: string }
  )
  | PathInfo & { error?: never }
