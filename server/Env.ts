import { CacheBase } from "../util/cache/base.ts"
import { Provider } from "./Provider.ts"

export class Env {
  upgradedHref
  providers

  constructor(
    readonly href: string,
    readonly cache: CacheBase,
    readonly signal: AbortSignal,
    providersFactory: (env: Env) => Record<string, Record<string, Provider>>,
  ) {
    this.upgradedHref = href.replace(/^http/, "ws")
    this.providers = providersFactory(this)
  }
}
