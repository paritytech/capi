import { CacheBase } from "../util/cache/base.ts"
import { Provider, ProviderFactories } from "./Provider.ts"

export class Env {
  upgradedHref
  providers

  constructor(
    readonly href: string,
    readonly cache: CacheBase,
    readonly signal: AbortSignal,
    providerGroups: Record<string, ProviderFactories>,
  ) {
    this.upgradedHref = href.replace(/^http/, "ws")
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
