import { PromiseOr } from "../util/mod.ts"

export interface ResponseFactories {
  staticFile(req: Request, url: URL): PromiseOr<Response>
  code(req: Request, path: string, src: string): PromiseOr<Response>
  404(req: Request): PromiseOr<Response>
  500(req: Request, message?: string): PromiseOr<Response>
}
