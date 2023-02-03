import { Codegen } from "../codegen/mod.ts"
import { PromiseOr } from "../util/mod.ts"
import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export interface ProviderDigest {
  generatorId: string
  providerId: string
  cacheKey: string
  codegen: Codegen
}

export abstract class Provider {
  abstract generatorId: string
  abstract providerId: string

  constructor(readonly env: Env) {}

  abstract cacheKey(pathInfo: PathInfo): string
  abstract vRuntime(pathInfo: PathInfo): PromiseOr<string>
  abstract codegen(pathInfo: PathInfo): PromiseOr<Codegen>

  async digest(pathInfo: PathInfo): Promise<ProviderDigest> {
    return {
      generatorId: this.generatorId,
      providerId: this.providerId,
      cacheKey: this.cacheKey(pathInfo),
      codegen: await this.codegen(pathInfo),
    }
  }
}

export type ProviderFactory = (env: Env) => Provider
