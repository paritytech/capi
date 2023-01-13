import { Codegen } from "../../codegen/mod.ts"
import * as U from "../../util/mod.ts"
import { Host } from "../Host.ts"
import { PathInfo } from "../PathInfo.ts"

export abstract class ProviderBase {
  constructor(readonly host: Host) {}

  abstract target(pathInfo: PathInfo): ProviderTarget
}

export interface ProviderTarget {
  pathInfo: PathInfo
  codegen(): U.PromiseOr<Codegen>
}

export abstract class ProviderRunBase<ProviderState> implements ProviderTarget {
  constructor(readonly provider: ProviderState, readonly pathInfo: PathInfo) {}

  abstract codegen(this: PathInfo): U.PromiseOr<Codegen>
}
