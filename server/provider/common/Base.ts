import * as U from "../../../util/mod.ts"
import { ServerCtxBase } from "../../CtxBase.ts"

export abstract class Provider {
  declare ctx: ServerCtxBase

  abstract run(req: Request, path: string): U.PromiseOr<Response>
}
