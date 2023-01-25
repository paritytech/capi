import { Codegen } from "../codegen/mod.ts"
import * as U from "../util/mod.ts"
import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export abstract class Provider {
  abstract generatorId: string
  abstract providerId: string

  constructor(readonly env: Env) {}

  abstract codegen(pathInfo: PathInfo): U.PromiseOr<Codegen>
}

export type ProviderFactory = (env: Env) => Provider
