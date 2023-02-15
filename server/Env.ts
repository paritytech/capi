import { CacheBase } from "../util/cache/base.ts"
import { Provider, ProviderFactory } from "./Provider.ts"

export interface EnvProps {
  href: string
  signal: AbortSignal
  cache: CacheBase
  providerFactories: ProviderFactory[]
  dbg?: boolean
}

export class Env {
  href
  signal
  cache
  dbg
  providers: Record<string, Record<string, Provider>> = {}

  constructor({ href, signal, cache, providerFactories, dbg }: EnvProps) {
    this.href = href
    this.signal = signal
    this.cache = cache
    this.dbg = dbg ?? false
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
