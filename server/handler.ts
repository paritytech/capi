import { Handler, Status } from "../deps/std/http.ts"
import { Env } from "./Env.ts"
import * as f from "./factories.ts"
import { parsePathInfo } from "./PathInfo.ts"

export function handler(env: Env): Handler {
  return handleCors(handleErrors(async (request) => {
    const url = new URL(request.url)
    const { pathname } = url
    if (pathname === "/") return new Response("capi dev server active")
    if (pathname === "/capi_cwd") return new Response(Deno.cwd())
    const pathInfo = parsePathInfo(pathname)
    if (pathInfo) {
      const { vCapi, providerId, generatorId } = pathInfo
      if (vCapi) {
        return f.serverError(
          "The local Capi sever assumes the same version as itself; another cannot be specified.",
        )
      }
      const provider = env.providers[generatorId]?.[providerId]
      if (provider) {
        return await provider.handle(request, pathInfo)
      }
    }
    for (const dir of staticDirs) {
      try {
        const url = new URL(pathname.slice(1), dir)
        const res = await fetch(url)
        if (!res.ok) continue
        if (f.acceptsHtml(request)) {
          return f.html(await f.renderCode(await res.text()))
        }
        return res
      } catch (_e) {}
    }
    return f.notFound()
  }))
}

const staticDirs = ["../", "./static/"].map((p) => import.meta.resolve(p))

export function handleErrors(handler: Handler): Handler {
  return async (request, connInfo) => {
    try {
      return await handler(request, connInfo)
    } catch (e) {
      if (e instanceof Response) return e.clone()
      console.error(e)
      return f.serverError(Deno.inspect(e))
    }
  }
}

export function handleCors(handler: Handler): Handler {
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

    const res = await handler(request, connInfo)

    // Deno.upgradeWebSocket response objects cannot be modified
    if (res.headers.get("upgrade") !== "websocket") {
      for (const [k, v] of res.headers) {
        newHeaders.append(k, v)
      }

      return new Response(res.body, {
        headers: newHeaders,
        status: res.status,
        statusText: res.statusText,
      })
    }

    return res
  }
}
