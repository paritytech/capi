import { CacheBase } from "../util/cache/base.ts"
import { Provider, ProviderFactories } from "./Provider.ts"

export class Env {
  upgradedHref
  providerGroups

  constructor(
    readonly href: string,
    readonly cache: CacheBase,
    readonly signal: AbortSignal,
    providerFactoryGroups: Record<string, ProviderFactories>,
  ) {
    this.upgradedHref = href.replace(/^http/, "ws")
    this.providerGroups = Object.fromEntries(
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
