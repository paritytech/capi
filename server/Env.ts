import { CacheBase } from "../util/cache/base.ts"
import { Provider } from "./Provider.ts"

export class Env {
  upgradedHref
  providerGroups

  constructor(
    readonly href: string,
    readonly cache: CacheBase,
    readonly signal: AbortSignal,
    providerGroupsFactory: (env: Env) => Record<string, Record<string, Provider>>,
  ) {
    this.upgradedHref = href.replace(/^http/, "ws")
    this.providerGroups = providerGroupsFactory(this)
  }
}
