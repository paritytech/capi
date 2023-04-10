import { Handler, Status } from "../deps/std/http.ts"

export function createCorsHandler(handler: Handler): Handler {
  return async (request, connInfo) => {
    const newHeaders = new Headers()
    newHeaders.set("Access-Control-Allow-Origin", "*")
    newHeaders.set("Access-Control-Allow-Headers", "*")
    newHeaders.set("Access-Control-Allow-Methods", "*")
    newHeaders.set("Access-Control-Allow-Credentials", "true")

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: newHeaders,
        status: Status.NoContent,
      })
    }

    const response = await handler(request, connInfo)

    // Deno.upgradeWebSocket response objects cannot be modified
    if (response.headers.get("upgrade") !== "websocket") {
      for (const [k, v] of response.headers) {
        newHeaders.append(k, v)
      }

      return new Response(response.body, {
        headers: newHeaders,
        status: response.status,
        statusText: response.statusText,
      })
    }

    return response
  }
}
