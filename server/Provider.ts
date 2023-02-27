import { Env } from "./Env.ts"
import { PathInfo } from "./PathInfo.ts"

export abstract class Provider {
  constructor(readonly env: Env) {}

  abstract handle(request: Request, pathInfo: PathInfo): Promise<Response>
}
