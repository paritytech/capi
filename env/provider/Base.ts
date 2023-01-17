import { Codegen } from "../../codegen/mod.ts"
import * as U from "../../util/mod.ts"
import { Env } from "../Env.ts"
import { PathInfo } from "../PathInfo.ts"

export abstract class ProviderBase {
  declare env: Env
  abstract target(pathInfo: PathInfo): ProviderTarget
}

export interface ProviderTarget {
  junctions: string[]
  pathInfo: PathInfo
  codegen(): U.PromiseOr<Codegen>
}

export abstract class ProviderRunBase<ProviderState> implements ProviderTarget {
  abstract junctions: string[]

  constructor(readonly provider: ProviderState, readonly pathInfo: PathInfo) {}

  abstract codegen(this: PathInfo): U.PromiseOr<Codegen>
}
