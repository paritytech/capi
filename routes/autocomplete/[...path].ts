import { Handlers } from "$fresh/server.ts"

export const handler: Handlers = {
  GET(_req) {
    try {
      return new Response("TODO")
    } catch (_e) {
      throw new Error()
    }
  },
}
