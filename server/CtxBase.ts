import { CacheBase } from "../util/cache/mod.ts"
import { PromiseOr } from "../util/mod.ts"
import { Provider } from "./provider/mod.ts"

export interface ServerCtxBaseProps<Providers extends Record<string, Provider>> {
  providers: Providers
  cache: CacheBase
  signal: AbortSignal
}

export abstract class ServerCtxBase<
  Providers extends Record<string, Provider> = Record<string, Provider>,
> {
  providers
  cache
  signal

  constructor({ providers, cache, signal }: ServerCtxBaseProps<Providers>) {
    this.providers = providers
    this.cache = cache
    this.signal = signal

    for (const provider of Object.values(providers)) {
      provider.ctx = this
    }
  }

  abstract staticFile(req: Request, url: URL): PromiseOr<Response>
  abstract code(req: Request, path: string, src: string): PromiseOr<Response>
  abstract 404(req: Request): PromiseOr<Response>
  abstract 500(req: Request, message?: string): PromiseOr<Response>
}
