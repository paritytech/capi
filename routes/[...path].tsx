import { Handlers } from "$fresh/server.ts"

export const handler: Handlers = {
  GET(_req, ctx) {
    const path = ctx.params.path!
    try {
      return new Response(Deno.readFileSync(path))
    } catch (_e) {
      return ctx.renderNotFound()
    }
  },
}
