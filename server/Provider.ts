import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export abstract class Provider {
  constructor(readonly env: Env) {}

  abstract handle(request: Request, pathInfo: PathInfo): Promise<Response>
}

export type ProviderFactories = Record<string, ProviderFactory>
export type ProviderFactory = (env: Env) => Provider
