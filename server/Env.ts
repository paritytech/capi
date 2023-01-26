import { Provider, ProviderFactory } from "./Provider.ts"

export class Env {
  providers: Record<string, Record<string, Provider>> = {}

  constructor(readonly signal: AbortSignal, providersFactories: ProviderFactory[]) {
    providersFactories.forEach((f) => {
      const provider = f(this)
      const { generatorId, providerId } = provider
      const generatorProviders = this.providers[generatorId]
      if (generatorProviders) {
        if (generatorProviders[providerId]) {
          throw new Error(
            `${generatorId} Provider with \`providerId\` of \`${providerId}\` already initialized`,
          )
        }
        generatorProviders[providerId] = provider
      } else {
        this.providers[generatorId] = { [providerId]: provider }
      }
      return provider
    })
  }
}
