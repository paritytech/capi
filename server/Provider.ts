import { ConstRune } from "../fluent/ConstRune.ts"
import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export abstract class Provider {
  abstract generatorId: string
  abstract providerId: string

  constructor(readonly env: Env) {}

  abstract handle(request: Request, pathInfo: PathInfo): Promise<Response>
}

export type ProviderFactory = (env: Env) => Provider
