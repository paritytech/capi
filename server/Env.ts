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
}
