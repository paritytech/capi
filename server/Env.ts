import { parsePathInfo } from "./PathInfo.ts"
import { Provider, ProviderFactory } from "./Provider.ts"

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

  codegen(src: string) {
    const pathInfo = parsePathInfo(src)
    if (!pathInfo) throw new Error("Could not parse src")
    const { generatorId, providerId } = pathInfo
    const generatorProviders = this.providers[generatorId]
    if (!generatorProviders) {
      throw new Error(`Could not match provider with generatorId of \`${generatorId}\``)
    }
    const provider = generatorProviders[providerId]
    if (!provider) {
      throw new Error(
        `Could not match ${generatorId} provider with providerId of \`${providerId}\``,
      )
    }
    return provider.codegen(pathInfo)
  }
}
