import { CacheBase } from "../util/cache/mod.ts"
import { PromiseOr } from "../util/mod.ts"
import { Provider } from "./provider/mod.ts"

export abstract class ServerCtxBase<
  Providers extends Record<string, Provider<unknown>> = Record<string, Provider<any>>,
> {
  constructor(
    readonly cache: CacheBase,
    readonly providers: Providers,
    readonly signal: AbortSignal,
  ) {
    for (const provider of Object.values(providers)) {
      provider.ctx = this
    }
  }

  abstract staticFile(req: Request, url: URL): PromiseOr<Response>
  abstract code(req: Request, path: string, src: string): PromiseOr<Response>
  abstract 404(req: Request): PromiseOr<Response>
  abstract 500(req: Request, message?: string): PromiseOr<Response>
}
