import { CacheBase } from "../util/cache/mod.ts"
import { Provider } from "./provider/mod.ts"

export class Ctx {
  constructor(
    readonly cache: CacheBase,
    readonly providers: Provider<any>[],
    readonly signal: AbortSignal,
  ) {
    providers.forEach((provider) => (provider.ctx = this))
  }
}
