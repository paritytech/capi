import { CacheBase } from "../util/cache/base.ts"
import { Provider, ProviderFactories } from "./Provider.ts"

export class Env {
  httpHref
  wsHref
  providers

  constructor(
    readonly port: number,
    readonly cache: CacheBase,
    readonly signal: AbortSignal,
    providerGroups: Record<string, ProviderFactories>,
  ) {
    this.httpHref = `http://localhost:${port}`
    this.wsHref = `ws://localhost:${port}`
    this.providers = Object.fromEntries(
      Object
        .entries(providerGroups)
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
