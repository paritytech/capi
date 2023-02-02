import { Codegen } from "../codegen/mod.ts"
import { parsePathInfo } from "./PathInfo.ts"
import { Provider, ProviderFactory } from "./Provider.ts"

export interface ProviderDigest {
  generatorId: string
  providerId: string
  cacheKey: string
  codegen: Codegen
}

export class Env {
  providers: Record<string, Record<string, Provider>> = {}

  constructor(readonly signal: AbortSignal, providerFactories: ProviderFactory[]) {
    for (const factory of providerFactories) {
      const provider = factory(this)
      const { generatorId, providerId } = provider
      const generatorProviders = this.providers[generatorId] ??= {}
      if (generatorProviders[providerId]) {
        throw new Error(
          `${generatorId} Provider with \`providerId\` of \`${providerId}\` already initialized`,
        )
      }
      generatorProviders[providerId] = provider
    }
  }

  digest(src: string): Promise<ProviderDigest> {
    const pathInfo = parsePathInfo(src)
    if (!pathInfo) throw new Error(`Could not parse src \`${src}\``)
    const { generatorId, providerId } = pathInfo
    const provider = this.providers[generatorId]?.[providerId]
    if (!provider) throw new Error(`Could not match ${generatorId}/${providerId} provider`)
    return provider.digest(pathInfo)
  }
}
