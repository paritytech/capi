import { Codegen } from "../codegen/mod.ts"
import { PromiseOr } from "../util/mod.ts"
import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export abstract class Provider {
  abstract generatorId: string
  abstract providerId: string

  constructor(readonly env: Env) {}

  abstract cacheKey(pathInfo: PathInfo): string
  abstract vRuntime(pathInfo: PathInfo): PromiseOr<string>
  abstract codegen(pathInfo: PathInfo): PromiseOr<Codegen>
}

export type ProviderFactory = (env: Env) => Provider
