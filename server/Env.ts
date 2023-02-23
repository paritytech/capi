import { CacheBase } from "../util/cache/base.ts"
import { Provider, ProviderFactories } from "./Provider.ts"

export interface EnvProps {
  href: string
  signal: AbortSignal
  cache: CacheBase
  providerFactoryGroups: Record<string, ProviderFactories>
  dbg?: boolean
}

export class Env {
  href
  signal
  cache
  dbg
  providers

  constructor({ href, signal, cache, providerFactoryGroups, dbg }: EnvProps) {
    this.href = href
    this.signal = signal
    this.cache = cache
    this.dbg = dbg ?? false
    this.providers = Object.fromEntries(
      Object
        .entries(providerFactoryGroups)
        .map(([group, providerFactories]): [string, Record<string, Provider>] => [
          group,
          Object.fromEntries(
            Object
              .entries(providerFactories)
              .map(([providerId, providerFactory]): [string, Provider] => [
                providerId,
                providerFactory(this),
              ]),
          ),
        ]),
    )
  }
}
