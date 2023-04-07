import * as f from "./factories.ts"

export function createErrorHandler(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (e) {
      if (e instanceof Response) return e.clone()
      console.error(e)
      return f.serverError(Deno.inspect(e))
    }
  }
}
